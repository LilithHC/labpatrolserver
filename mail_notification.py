# from robot.model.statistics import Statistics
# used to generate a html page
# used to send email
from cafe.core.db import TestDB
from cafe.util.version import get_version_info
from subprocess import getstatusoutput
from envelopes import Envelope

from html3.html3 import HTML
from robot.api import ExecutionResult
from robot.run import run_cli

import cafe.doc_gen.mail_gen.report_data_struct as struct
import cafe.sessions.atlassian
import caferobot.restful.adapter
import datetime
import jinja2
import json
import os
import re
import requests
import robot.model.statistics as robot_statistics
import shutil
import sys
import time
import yaml


class MailUnitTest():

    def __init__(self, cafe_path=None, cfg_path='', xml_path_list=[]):
        if not os.path.isabs(cfg_path) and os.getenv(cafe_path) is not None:
            cfg_path = self.format_url(os.getenv(cafe_path)) + cfg_path

        elif not os.path.isabs(cfg_path) and os.getenv(cafe_path) is None:
            pythonpath = os.getenv('PYTHONPATH').split(':')

            for item in pythonpath:
                abspath = self.format_url(item) + cfg_path
                exist_flag = True
                for xml in xml_path_list:
                    if not os.path.exists(self.format_url(abspath) + xml):
                        exist_flag = False
                if exist_flag is False:
                    continue
                else:
                    cfg_path = self.format_url(item) + cfg_path
                    break

        self.cfgmap = cfg_path
        self.args = xml_path_list

    def format_url(self, url):
        if not url.endswith('/'):
            url = url + '/'
        return url

    def generate_report(self):
        send(self.cfgmap, self.args)


class CafeMail():

    def __init__(self, dictionary={}, args=[]):
        self.mail_info = dictionary

        if 'read_option' not in self.mail_info:
            raise ValueError('Please add <read_option> in mail_info.yaml, '
                             'the option: robot or cafe')

        if 'recipient' not in self.mail_info:
            is_fail, user_email = getstatusoutput('git config --get user.email')
            if is_fail:
                raise ValueError('Please add <recipient> in mail_info.yaml')
            else:
                self.mail_info['recipient'] = user_email
        # self.mail_info['recipient_list']= []
        self.mail_info['recipient_list'] = re.split(';|,', self.mail_info.get('recipient'))
        self.mail_info['cc_list'] = re.split(';|,', self.mail_info.get('cc_recipient')) \
            if 'cc_recipient' in self.mail_info and self.mail_info.get('cc_recipient') is not None else None

        if 'publisher' not in self.mail_info:
            self.mail_info['publisher'] = 'cafe_mail_report@calix.com'

        if 'smtp_server' not in self.mail_info:
            self.mail_info['smtp_server'] = 'eng-smtp.calix.local'

        if 'subject' not in self.mail_info:
            current_time = time.strftime('%Y-%m-%d',
                                         time.localtime(time.time()))
            self.mail_info['subject'] = 'Just Test Mail - Don\'t reply this '\
                                     +current_time

        self.mode = self.mail_info['read_option'].lower()
        if 'key_to_search_issuelink' not in self.mail_info:
            self.mail_info['key_to_search_issuelink'] = ''
        if 'is_fetch_tms' not in self.mail_info:
            self.mail_info['is_fetch_tms'] = False

        if 'pass_rate_threshold' not in self.mail_info:
            self.mail_info['pass_rate_threshold'] = {'minum_pass': 100, 'minum_unstable': 50}
        elif not self.mail_info['pass_rate_threshold']['minum_pass']:
            self.mail_info['pass_rate_threshold']['minum_pass'] = 100
        elif 'minum_unstable' not in self.mail_info['pass_rate_threshold']:
            self.mail_info['pass_rate_threshold']['minum_unstable'] = 50

        self.test_stats = []
        self.test_suite = []

        if 'cafe' in self.mode:
            # TODO
            xml_report_path = None
        elif 'robot' in self.mode:
            # name,total passed,failed elapsed
            # self.robot_resu.lt_fields = ['name', 'total', 'passed','failed','elapsed' ]
            temp_xml_path = os.path.abspath('./temp')
            if os.path.exists(temp_xml_path):
                try:
                    shutil.rmtree(temp_xml_path)
                    print('remove exist xml temp folder success')
                except Exception:
                    print('remove exist xml temp folder error')
                    raise Exception

            os.makedirs(temp_xml_path)
            xml_result = []

            if args == []:
                xml_report_path = os.path.abspath('./output.xml')
                print(xml_report_path)
                self._get_xml_result_by_path(xml_report_path)
                # xml_result.append(ExecutionResult(xml_report_path))
            else:
                for index, arg in enumerate(args):
                    if str(arg).lower().startswith('http://'):
                        file_name = 'temp%s.xml' % index
                        xml_report_path = '%s/%s' % (temp_xml_path, file_name)
                        download_file(arg, path=xml_report_path)
                    else:
                        if os.path.isabs(arg):
                            xml_report_path = arg
                        else:
                            xml_report_path = dictionary.get('cfg_path') + '/' + arg
                    self._get_xml_result_by_path(xml_report_path)
        self._init_sql_engine()
        self._init_html_page()

    def _get_xml_result_by_path(self, xml_path):
        print('========')
        print(xml_path)
        print('========')
        if not os.path.exists(xml_path):
            xml_data = '''<?xml version="1.0" encoding="UTF-8"?>
            <robot generated="19700101 00:00:00.000" generator="Robot 3.0 (Python 2.7.8 on linux2)">
            <suite source="default.robot" id="s1" name="Test">
            <testSystem id="s1-t1" name="empty case">
            <kw name="Log" library="default">
            <arguments>
            <arg>empty</arg>
            </arguments>
            <status status="NOT_RUN" endtime="19700101 00:00:00.000" starttime="19700101 00:00:00.000"></status>
            </kw>
            <tags>
            <tag>@eut=</tag>
            <tag>@user_interface=</tag>
            <tag>empty</tag>
            </tags>
            <status status="PASS" endtime="19700101 00:00:00.000" critical="yes" starttime="19700101 00:00:00.000"></status>
            </testSystem>
            <status status="PASS" endtime="19700101 00:00:00.000" starttime="19700101 00:00:00.000"></status>
            </suite>
            <statistics>
            <total>
            <stat fail="0" pass="0">Critical Tests</stat>
            <stat fail="0" pass="0">All Tests</stat>
            </total>
            <tag>
            <stat fail="0" pass="0">@eut=</stat>
            <stat fail="0" pass="0">@user_interface=</stat>
            <stat fail="0" pass="0">empty</stat>
            </tag>
            <suite>
            <stat fail="0" id="s1" name="Test" pass="0">Test</stat>
            </suite>
            </statistics>
            <errors>
            </errors>
            </robot>
            '''
            default_file = open(xml_path, 'w')
            default_file.writelines(xml_data)
            default_file.close()
        test_result = ExecutionResult(xml_path)

        self.test_stats.append(test_result.statistics)
        self.test_suite.append(test_result.suite)

    def _init_html_page(self):
        # Use inline styles where ever possible in html email.
        self.inline_css = {
            'stats-col-name': 'text-align: center;',
            'stats-col-stat': 'text-align: left;',
            'failed': 'background:red',
            'statistics': 'width: 52em; border-collapse: collapse;',
            'stats-row-head': 'background: #44367D; color: #FFF;',
        }
        self.html_page = HTML('body')

    def _init_sql_engine(self):
        self.db = TestDB(db_uri='sqlite:///my_sqlite.db')
        # self.db = TestDB(db_uri='sqlite:///my_sqlite.db', echo=True)

    def summary_result(self):
        print((self.db.get_summary_report_text()))

    def testsuite_result(self):
        print((self.db.get_testsuite_report_text(1)))

    # commented out 8/9/21 as db class does not have the function get_testcase_report_by_id_text
    # def testcase_result(self):
        # print(self.db._get_testcase_report_by_id_text(1))

    # commented out 8/9/21 as db class does not have the function get_data_by_type_text
    # def testdata_result(self):
        # print(self.db.get_data_by_type_text())

    def gen_robot_table(self, stats_mode):
        with self.html_page.table(border='1',
                  style=self.inline_css['statistics']) as table:
            columns = self.robot_result_fields

            # table head
            row = table.tr
            for item in columns:
                if item == 'name':
                    item = item.replace('name',
                           'Statistics by {}'.format(stats_mode.capitalize()))
                    row.td(style=self.inline_css['stats-col-name']
                                 +self.inline_css['stats-row-head']).b(item)
                else:
                    row.td(style=self.inline_css['stats-col-stat']
                                 +self.inline_css['stats-row-head']).b(item)

            # table body
            for stats in getattr(self.test_stats, stats_mode):
                row = table.tr
                for item in columns:
                    row.td(str(getattr(stats, item)),
                           sytle=self.inline_css['stats-col-stat'])
        self.html_page.br

    def gen_robot_html_page(self):
        list(map(self.gen_robot_table, ['suite', 'tags']))
        return str(self.html_page)

    # TODO
    def gen_cafe_html_page(self):
        pass

    def get_detail_by_tags(self, default_tag=''):
        # columns = self.robot_result_fields
        return_list = []
        for each_item in self.test_stats:
            return_dict = {}
            return_dict[default_tag] = []
            for stats in getattr(each_item, 'tags'):
                text = str(stats.__dict__['name'])
                # m = re.search(u'(?<=@).+', text)
                m = re.search(r'^@(.+?)=(.+)', text)
                if m:
                    # key = m.group(0).split('=')[0].strip(' ').upper()
                    # value = m.group(0).split('=')[1].strip(' ').upper()
                    key, value = m.group(1).upper(), m.group(2).upper()
                    jira_link = ''
                    if self.mail_info['is_fetch_tms'] is True and key == self.mail_info['key_to_search_issuelink']\
                            and stats.__dict__['failed'] != 0:
                        # 'PREM-13146' can be taken as a unit testSystem value
                        jira_link = get_tms_result(self.mail_info.get('tms_1'), value)
                    if key not in return_dict:
                        return_dict[key] = []
                    else:
                        pass
                    tag_det = struct.ReportDetailPerTag(tag=value, tag_passed_number=stats.__dict__['passed'],
                                               tag_failed_number=stats.__dict__['failed'], tag_comments=jira_link)
                    return_dict.get(key).append(tag_det.__dict__)

                else:
                    tag_det = struct.ReportDetailPerTag(tag=text.lower(), tag_passed_number=stats.__dict__['passed'],
                                               tag_failed_number=stats.__dict__['failed'], tag_comments='')
                    return_dict.get(default_tag).append(tag_det.__dict__)
                    print(('This tag is not a valid render Tag format, save it directly====>%s' % text))

            return_list.append(return_dict)
        return return_list

    def get_test_status(self, pass_rate=100):
        if pass_rate >= self.mail_info['pass_rate_threshold']['minum_pass']:
            return 'PASS'
        elif pass_rate >= self.mail_info['pass_rate_threshold']['minum_unstable']:
            return 'UNSTABLE'
        else:
            return 'FAIL'


def send(cfg_path=None, xml_path_list=[]):
    if (cfg_path is None):
        cfg_file = './report_info.yaml'
    else:
        cfg_file = cfg_path + '/report_info.yaml'
    try:
        cfg_map = yaml.load(open(cfg_file), Loader=yaml.Loader)
    except (OSError, BaseException):
        raise BaseException('Config file load fail ,please check the report_info.yaml file is exist ')

    cfg_map['cfg_path'] = cfg_path
    cm = CafeMail(cfg_map, xml_path_list)
    tag_detail_list = cm.get_detail_by_tags('UNDEFINED')
    print((json.dumps(tag_detail_list, sort_keys=True, indent=2, separators=(',', ': '))))
    summary_list = []
    # print cm.test_stats[0].__dict__
    for index, stat_summary in enumerate(cm.test_stats):
        report_sum = struct.ReportSummary(cfg_map)
        report_sum.case_pass_number = stat_summary.total.passed
        report_sum.case_fail_number = stat_summary.total.failed
        report_sum.total_case_number = stat_summary.total.total
        report_sum.test_execution_time = int(cm.test_suite[index].elapsedtime / 1000)
        pass_rate_sum = round(float(report_sum.case_pass_number) / \
                                         (float(report_sum.case_fail_number) + float(report_sum.case_pass_number)) * 100, 2)
        report_sum.total_pass_rate = str(pass_rate_sum) + '%'

        report_sum.test_start_time = datetime.datetime.strptime(cm.test_suite[index].starttime, "%Y%m%d %H:%M:%S.%f").strftime('%Y/%m/%d %H:%M:%S')
        report_sum.test_stop_time = datetime.datetime.strptime(cm.test_suite[index].endtime, "%Y%m%d %H:%M:%S.%f").strftime('%Y/%m/%d %H:%M:%S')
        # report_sum.result_summary = cm.test_suite[index].status
        report_sum.result_summary = cm.get_test_status(pass_rate=pass_rate_sum)
        report_sum.case_average_time = round(float(report_sum.test_execution_time) / float(report_sum.total_case_number), 3)
        summary_list.append(report_sum)

        print((json.dumps(report_sum.__dict__, sort_keys=True, indent=2, separators=(',', ': '))))
    # print report_sum.__dict__

    # print json.dumps(summary_list, sort_keys=True, indent=2, separators=(',', ': '))
    print((report_sum.template_folder))
    print((report_sum.template_file))
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(report_sum.template_folder))
    env.filters['convert_seconds'] = convert_seconds
    env.filters['convert_minutes'] = convert_minutes
    template = env.get_template(report_sum.template_file)
    rendered_page = template.render(sum_list=summary_list, tag_list=tag_detail_list)

    if (os.path.exists('./test_report.html')):
        os.remove('./test_report.html')
    else:
        pass

    f1 = open('./test_report.html', 'w')
    f1.writelines(rendered_page)
    f1.close()

    html_content = rendered_page

    envelope = Envelope(
        from_addr=cm.mail_info.get('publisher'),
        to_addr=cm.mail_info.get('recipient_list'),
        cc_addr=cm.mail_info.get('cc_list') if cm.mail_info.get('cc_list') is not None else None,
        subject='[' + summary_list[-1].__dict__.get('result_summary') + ']' + cm.mail_info.get('subject')
                +',Build ID:' + str(summary_list[-1].__dict__.get('build_id')),
        html_body=html_content,
    )
    return envelope.send(host=cm.mail_info.get('smtp_server'))


def get_tms_result(tms_map={}, tms_id=''):

    print('mail_notification.get_tms_result had been deprecated.')
    return None
    # session = RestfulSession(user=tms_map.get('user'), password=tms_map.get('password'))
    # tmsHelper = atlassian.TMSHelper(session, tms_map.get('url'), tms_map.get('api_version'))
    # return tmsHelper.get_failed_jira_link_by_tms_id(tms_id)


def convert_seconds(value, format='%H:%M:%S'):
    if value.strip():
        return time.strftime(format, time.gmtime(int(value)))


def convert_minutes(value):
    if value.strip():
        return round(float(value) / 60, 2)


def download_file(url, path, username='cdccafe', password='Calix123'):
    """Download output.xml file
    For cdc-bamboo, before downloading file, it needs user login, otherwise downloading will fail.

    Args:
        url: output.xml url
        path: local path for saving output.xml file
        username: username for login cdc-bamboo and sandbamboo
        password: password for login cdc-bamboo and sandbamboo
    """
    path = os.path.abspath(path)
    if not os.path.exists(os.path.dirname(path)):
        try:
            os.makedirs(os.path.dirname(path))
        except OSError as e:
            print((e))
            raise

    r = requests.get(url, stream=True, auth=(username, password))
    if not r.ok:
        raise RuntimeError('download %s failed, error is %s' % (url, r.reason))

    with open(path, 'w') as f:
        print(('download %s to %s' % (url, path)))
        f.write(r.content)
