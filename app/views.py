from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Products
import json

# Create your views here.
def register(request):
  if request.method=='POST':  
    name = request.POST['name']
    email = request.POST['email']
    password = request.POST['password']
    if name and password and email:
        query = User.objects.create_user(first_name=name,email=email,password=password,username=email)
        query.save()     
        login(request, query)
        return redirect('home')
    return JsonResponse({'error':'invalid form creds'})
  else:
    return render(request, 'auth/register.html')
  
def login_view(request):
  if request.method == 'POST':
     email = request.POST.get('email')
     password = request.POST.get('password')
     user = authenticate(request, username=email, password=password)
     if user :
        login(request, user)
        return redirect('home')
     return JsonResponse({"error":"This user not exists."})
  else:
     return render(request, 'auth/login.html')   



def home(request):
  return render(request, 'main/index.html')  

def shop(request):
    products = Products.objects.all()
    return render(request, 'main/shop.html', {'data': products})
 
@login_required
def cart(request):
  return render(request, 'main/cart.html')  

@login_required
def profile(request):
  return render(request, 'main/profile.html')  

# Products CRUD ENDPOINTS

def add_bulk_products(request):
    if request.method == "GET":
        # 20 sample products
        sample_products = [
  {
    "name": "Smart Coffee Maker X10",
    "price": 229.99,
    "specs": "WiFi, Mobile App Control, 12 Cups",
    "desc": "Brew coffee remotely with customizable strength settings.",
    "img": "../../static/img/coffee_maker_x10.jpg"
  },
  {
    "name": "Noise Cancelling Earbuds Pro",
    "price": 149.00,
    "specs": "ANC, Wireless Charging, 24hr Battery",
    "desc": "Compact earbuds with superior sound and call quality.",
    "img": "../../static/img/earbuds_pro.jpg"
  },
  {
    "name": "Curved Gaming Monitor 32”",
    "price": 499.50,
    "specs": "32 inch, 165Hz, QHD Resolution",
    "desc": "Immersive curved monitor built for gamers.",
    "img": "../../static/img/curved_monitor_32.jpg"
  },
  {
    "name": "Portable Projector MiniBeam",
    "price": 299.00,
    "specs": "1080p, 200 Lumens, HDMI/WiFi",
    "desc": "Pocket-sized projector for movies and presentations.",
    "img": "../../static/img/minibeam_projector.jpg"
  },
  {
    "name": "Smart Vacuum Cleaner V7",
    "price": 399.00,
    "specs": "Robot, Lidar Mapping, Auto-Charge",
    "desc": "Hands-free cleaning with smart scheduling.",
    "img": "../../static/img/vacuum_v7.jpg"
  },
  {
    "name": "E-Reader Light 2",
    "price": 129.99,
    "specs": "6 inch E-Ink, 8GB Storage, Backlight",
    "desc": "Comfortable reading device with long-lasting battery.",
    "img": "../../static/img/ereader_light2.jpg"
  },
  {
    "name": "Action Camera GoCam 4K",
    "price": 249.50,
    "specs": "4K60fps, Waterproof 10m, WiFi",
    "desc": "Capture adventures with stunning clarity.",
    "img": "../../static/img/gocam_4k.jpg"
  },
  {
    "name": "Mechanical Gaming Mouse",
    "price": 79.99,
    "specs": "12 Side Buttons, RGB Lighting",
    "desc": "Optimized mouse for MMO and RPG gamers.",
    "img": "../../static/img/gaming_mouse.jpg"
  },
  {
    "name": "Smart Thermostat Eco",
    "price": 189.00,
    "specs": "AI Scheduling, WiFi, Touchscreen",
    "desc": "Save energy with intelligent temperature control.",
    "img": "../../static/img/thermostat_eco.jpg"
  },
  {
    "name": "Portable Power Bank 20000mAh",
    "price": 59.00,
    "specs": "65W PD, Dual USB-C, Fast Charging",
    "desc": "Massive capacity to charge laptops and phones.",
    "img": "../../static/img/power_bank_20000.jpg"
  },
  {
    "name": "Smart Lighting Kit RGB",
    "price": 89.99,
    "specs": "Voice Control, WiFi, 16M Colors",
    "desc": "Create moods with smart RGB lighting.",
    "img": "../../static/img/lighting_kit_rgb.jpg"
  },
  {
    "name": "Standing Desk Electric",
    "price": 499.99,
    "specs": "Dual Motor, Memory Presets, 140x70cm",
    "desc": "Ergonomic desk with smooth height adjustment.",
    "img": "../../static/img/standing_desk.jpg"
  },
  {
    "name": "Gaming Chair Supreme",
    "price": 349.00,
    "specs": "PU Leather, Adjustable Armrests, Lumbar Support",
    "desc": "Comfortable gaming chair for long sessions.",
    "img": "../../static/img/gaming_chair.jpg"
  },
  {
    "name": "Smart Door Lock SecureX",
    "price": 229.00,
    "specs": "Fingerprint, PIN, WiFi Control",
    "desc": "Keyless entry system with advanced security.",
    "img": "../../static/img/door_lock.jpg"
  },
  {
    "name": "Electric Bike Urban Rider",
    "price": 1299.00,
    "specs": "250W Motor, 60km Range, Disc Brakes",
    "desc": "Eco-friendly e-bike for urban commuting.",
    "img": "../../static/img/electric_bike.jpg"
  },
  {
    "name": "Smart Mirror Touch",
    "price": 799.00,
    "specs": "Touchscreen, Health Monitoring, WiFi",
    "desc": "Interactive mirror with fitness and smart home features.",
    "img": "../../static/img/smart_mirror.jpg"
  },
  {
    "name": "Portable Grill Pro",
    "price": 179.50,
    "specs": "Gas/Electric, Foldable, Non-stick",
    "desc": "Take your barbecue anywhere with this portable grill.",
    "img": "../../static/img/portable_grill.jpg"
  },
  {
    "name": "3D Printer MakerLab",
    "price": 699.00,
    "specs": "220x220x250mm, PLA/ABS, WiFi",
    "desc": "Affordable 3D printer for hobbyists and pros.",
    "img": "../../static/img/3d_printer.jpg"
  },
  {
    "name": "Smart Washing Machine 8kg",
    "price": 899.00,
    "specs": "AI Wash, Eco Mode, Mobile App",
    "desc": "Efficient washing machine with remote control.",
    "img": "../../static/img/washing_machine.jpg"
  },
  {
    "name": "Portable Air Conditioner",
    "price": 399.99,
    "specs": "12000 BTU, Remote, Dehumidifier",
    "desc": "Stay cool anywhere with this compact AC unit.",
    "img": "../../static/img/portable_ac.jpg"
  }
]
       
        for sample_product in sample_products:
            query = Products(name = sample_product.name,price= sample_product.price,specs = sample_product.specs,desc = sample_product.desc)
            query.save()
        return JsonResponse({"message":"20 products saved"})
        


 
