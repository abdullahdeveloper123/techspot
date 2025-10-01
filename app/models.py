from django.db import models
from django.utils import timezone

# Create your models here.

class Products(models.Model):
    name = models.CharField(max_length=255)
    price = models.CharField(max_length=255)
    specs = models.TextField()
    desc = models.TextField()
    img = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
       

    def __str__(self):
        return self.name
