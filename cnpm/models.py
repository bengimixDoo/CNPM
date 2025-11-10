from django.db import models

class exemple(models.Model):
	id = models.IntegerField(primary_key=True)
	name = models.TextField()
	value = models.FloatField()

	def __str__(self) -> str:
		return f"{self.name} ({self.id})"
	class Meta:
		db_table = "exemple"
