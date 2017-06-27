# {
#   "simulations": [
#     {
#       "test_id": "test4",
#       "description": "using the new batch job assignment algorithm",
#       "data_start_time": "2017-06-01 08:00:00",
#       "data_end_time": "2017-06-02 08:00:00",
#       "created_at": "2017-06-19 08:00:00",
#       "kpis": [
#         {
#           "name": "batch_size",
#           "value": 30,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test4"
#         },
#         {
#           "name": "KPI2",
#           "value": 0.3,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test4"
#         },
#         {
#           "name": "KPI3",
#           "value": 70,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test4"
#         }
#       ]
#     },
#     {
#       "test_id": "test5",
#       "description": "using the new batch job assignment algorithm",
#       "data_start_time": "2017-06-01 08:00:00",
#       "data_end_time": "2017-06-02 08:00:00",
#       "created_at": "2017-06-19 08:00:00",
#       "kpis": [
#         {
#           "name": "batch_size",
#           "value": 30,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test5"
#         },
#         {
#           "name": "KPI2",
#           "value": 0.55,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test5"
#         },
#         {
#           "name": "KPI3",
#           "value": 60,
#           "kpi_datetime": "2017-06-01 08:00:00",
#           "test_id": "test5"
#         }
#       ]
#     }
#   ]
# }

from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from .models import SimuSummary, SimuKPISummary
from collections import defaultdict 
import json
from datetime import timedelta, datetime, tzinfo
from .helper import GMT8
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
import sys
import pandas as pd
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))


def get_simulations(request):
    simulation_kpi_list = SimuKPISummary.objects.values(
        'simulation', 'kpi_name', 'kpi_value', 'kpi_datetime').order_by('simulation', 'kpi_name')
    kpi_list = ['batch_size', 'KPI2', 'KPI3']
    output = []
    kpi_dict = defaultdict(dict)
    for kpi in simulation_kpi_list:
        kpi['kpi_datetime'] = datetime_convertor(kpi['kpi_datetime'])
        kpi_dict[kpi['simulation']][kpi['kpi_name']] = kpi['kpi_value']
    simulation_id_list = kpi_dict.keys()
    # simulation_id_list.sort()
    for test_id in simulation_id_list:
        simulation_test = SimuSummary.objects.get(test_id=test_id)
        output.append(dict_convertor(simulation_test, kpi_dict, kpi_list))

    return HttpResponse(json.dumps({"simulations": output}, cls=DjangoJSONEncoder))


def read_csv_json(request):
    file_path = os.path.join(BASE_DIR, 'summary.csv')
    df = pd.read_csv(file_path, skiprows=[0], names=['ID', 'DESC', 'SHIP', 'COST', 'CNTR', 't11', 't5', 't1',
                                                     'CNTR_gross_fr', 't11_gross_fr',
                                                     't5_gross_fr', 't1_gross_fr', 'CNTR_net_fr', 't11_net_fr',
                                                     't5_net_fr', 't1_net_fr'])
    output = df.to_dict(orient='records')
    return HttpResponse(json.dumps({"simulations": output}, cls=DjangoJSONEncoder))


def read_csv_boxplot(request):
    file_path = os.path.join(BASE_DIR, 'boxplot_1_1.csv')
    df = pd.read_csv(file_path)
    data = [];
    for a in df.scenorio.unique():
        seriesData = [];
        for b in ['CNTR','11t','5t','1t']:
            cate = list(df.gross)
            seriesData.append(cate);
        data.append(seriesData)
    return HttpResponse(json.dumps({"simulations": data}, cls=DjangoJSONEncoder))


def read_csv_json_drill(request):
    file_path = os.path.join(BASE_DIR, 'drill.csv')
    df = pd.read_csv(file_path, skiprows=[0], names=['ID', 'DESC', 'SHIP', 'COST', 'TRUCKS', 'CNTR', 't11', 't5', 't1',
                                                     'CNTR_gross_fr', 't11_gross_fr',
                                                          't5_gross_fr', 't1_gross_fr', 'CNTR_net_fr', 't11_net_fr',
                                                     't5_net_fr', 't1_net_fr'])
    output = df.to_dict(orient='records')
    return HttpResponse(json.dumps({"simulations": output}, cls=DjangoJSONEncoder))


def index(request):
    return render_to_response('monitor/main.html')


def index2(request):
    return render_to_response('monitor/main2.html')


@csrf_exempt
def set_simulations(request):
    if request.method == 'POST':
        try:
            print(type(request), request)
            print(request.body.decode('utf-8'))
            if (isinstance(request.body,bytes)):
                json_data = json.loads(request.body.decode('utf-8'))
            elif (isinstance(request.body,str)):
                json_data = json.loads(request.body)
            else:
                return HttpResponse('Error')
            print('json_data', json_data)
            return update_data(json_data)
        except ValueError as e:
            print('e', e)
            return HttpResponse('Invalid JSON Format')
    else:
        return HttpResponse('Error')


def dict_convertor(simu_summary, kpi_dict, kpi_list):
    summary_dict = {}
    summary_dict['test_id'] = simu_summary.test_id
    summary_dict['description'] = simu_summary.description
    summary_dict['data_start_time'] = datetime_convertor(simu_summary.data_start_time)
    summary_dict['data_end_time'] = datetime_convertor(simu_summary.data_end_time)
    summary_dict['created_at'] = datetime_convertor(simu_summary.created_at)
    for kpi in kpi_list:
        if kpi in kpi_dict[simu_summary.test_id]:
            summary_dict[kpi] = kpi_dict[simu_summary.test_id][kpi]
        else:
            summary_dict[kpi] = None
    return summary_dict


def datetime_convertor(datetime_value):
    tmp_datetime_value = datetime_value.astimezone(GMT8())
    return tmp_datetime_value.strftime('%Y-%m-%d %H:%M:%S')


def update_data(json_data):
    try:
        for simulation in json_data['simulations']:
            print('simulation', simulation)
            try:
                simulation_summary = SimuSummary.objects.get(test_id=simulation['test_id'])
            except SimuSummary.DoesNotExist:
                simulation_summary = SimuSummary(test_id=simulation['test_id'])       
            simulation_summary.description = simulation['description']
            simulation_summary.data_start_time = convert_datetime(simulation['data_start_time'])
            simulation_summary.data_end_time = convert_datetime(simulation['data_end_time'])
            simulation_summary.created_at = convert_datetime(simulation['created_at'])
            simulation_summary.save()
            print('simulation_summary', simulation_summary)
            for kpi in simulation['kpis']:
                print('kpi', kpi)
                try:
                    kpi_summary = SimuKPISummary.objects.get(simulation=simulation_summary, kpi_name=kpi['name'])
                except SimuKPISummary.DoesNotExist:
                    kpi_summary = SimuKPISummary(simulation=simulation_summary, kpi_name=kpi['name'])
                kpi_summary.kpi_value = kpi['value']
                kpi_summary.kpi_datetime = convert_datetime(kpi['kpi_datetime'])
                kpi_summary.save()
                print('kpi_summary', kpi_summary)
        return HttpResponse('OK')
    except:
        print("Unexpected error:", sys.exc_info())
        return HttpResponse('Error') 


def convert_datetime(time_str):
    time_info = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
    return datetime(time_info.year,time_info.month,time_info.day,time_info.hour,time_info.minute,time_info.second,tzinfo=GMT8())