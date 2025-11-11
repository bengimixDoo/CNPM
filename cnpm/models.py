from django.db import models

class HoKhau(models.Model):
    mahokhau = models.CharField(db_column='mahokhau', primary_key=True, max_length=10)
    diachi = models.CharField(db_column='diachi', max_length=30)
    ngaylap = models.DateField(db_column='ngaylap', null=True)
    ngaychuyendi = models.DateField(db_column='ngaychuyendi', null=True)
    lydochuyendi = models.CharField(db_column='lydochuyendi', max_length=255, null=True)
    dientichho = models.FloatField(db_column='dientichho', null=True)
    soxemay = models.IntegerField(db_column='soxemay', null=True)
    sooto = models.IntegerField(db_column='sooto', null=True)
    soxedap = models.IntegerField(db_column='soxedap', null=True)
    
    def __str__(self):
        return f"HoKhau {self.mahokhau} - {self.diachi}"

    class Meta:
        db_table = 'hokhau'
        managed = False
	

