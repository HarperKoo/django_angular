from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^drill/$', views.index2, name='index2'),
    url(r'^update/$', views.set_simulations, name='update'),
    url(r'^summary/$', views.read_csv_json, name='summary'),
    url(r'^boxplot/$', views.read_csv_boxplot, name='boxplot'),
    url(r'^drill/drill_summary/$', views.read_csv_json_drill, name='drill_summary'),
]