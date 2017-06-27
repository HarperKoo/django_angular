from django.db import models


# CREATE TABLE simulation_summary (
# id bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
# testid varchar(8) NOT NULL COMMENT 'test id',
# data_start_time datetime DEFAULT NULL COMMENT 'data start time',
# data_end_time datetime DEFAULT NULL COMMENT 'data end time',
# createdAt datetime DEFAULT NULL COMMENT 'update time',
# description varchar(200) DEFAULT NULL COMMENT 'description of this test',
# PRIMARY KEY(id)
# ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT='simulation summary table';
 

# CREATE TABLE simulation_kpi_summary(
# id bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
# testid varchar(8) NOT NULL COMMENT 'test id',
# KPI_name varchar(20) NOT NULL COMMENT 'KPI name',
# KPI_value decimal(10,6) NOT NULL COMMENT 'KPI value',
# kPI_datetime datetime DEFAULT NULL COMMENT 'kPI date time',
# createdAt datetime DEFAULT NULL COMMENT 'update time'
# )


# Create your models here.
class SimuSummary(models.Model):
    test_id = models.CharField(max_length=200, primary_key=True)
    description = models.CharField(max_length=200)
    data_start_time = models.DateTimeField('data start time')
    data_end_time = models.DateTimeField('data end time')
    created_at = models.DateTimeField('date created')

    class Meta:
        verbose_name = 'Simulation'
        verbose_name_plural = 'Simulations'

    def __str__(self):
        return self.test_id


class SimuKPISummary(models. Model):
    simulation = models.ForeignKey(SimuSummary, on_delete=models.CASCADE)
    kpi_name = models.CharField(max_length=100)
    kpi_value = models.DecimalField(max_digits=18, decimal_places=6, default=0.0)
    kpi_datetime = models.DateTimeField('kpi date')

    class Meta:
        verbose_name = 'Simulation KPI'
        verbose_name_plural = 'Simulation KPIs'

    def __str__(self):
        return self.simulation.test_id + ' ' + self.kpi_name






