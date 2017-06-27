from datetime import timedelta, datetime, tzinfo

class GMT8(tzinfo):
    def utcoffset(self, dt):
        return timedelta(hours=8) + self.dst(dt)
    def dst(self, dt):
        return timedelta(0)
    def tzname(self,dt):
        return "GMT +8"
