from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login_view'),
    path('home/', views.home, name='home'),
    path('shop/', views.shop, name='shop'),
    path('cart/', views.cart, name='cart'),
    path('profile/', views.profile, name='profile'),
    path('add-bulk-products/', views.add_bulk_products, name='add_bulk_products'),



]