from django.db.models.signals import post_save
from django.dispatch import receiver
from PIL import Image, UnidentifiedImageError
import os, tempfile
from django.core.exceptions import ValidationError
from Jobs.models import Company

# @receiver(post_save, sender =Company)
# def optimize_logo(sender, instance, created, **kwargs):
   
#         if not instance.logo or not instance.logo.name:
#             return
        
#         img_path = instance.logo.path
#         if not os.path.exists(img_path):
#             return
        
#         MAX_BYTES = 1 * 1024 *1024
        
#         is_optimized_name = instance.logo.name.lower().endswith("_optimized.jpg")

#         file_size = os.path.getsize(img_path)
        
#         if is_optimized_name or file_size < MAX_BYTES:
#              return
        
#         try :
            
#             with Image.open(img_path) as img:

#                 if img.mode in ("RGBA", "P"):
#                     img = img.convert("RGB")
                
#                 max_size = (500,500)
#                 img.thumbnail(max_size)

#                 temp_fd, temp_path = tempfile.mkstemp(suffix=".jpg")
#                 img.save(temp_path, format="JPEG", quality = 60, optimize = True)
#                 os.close(temp_fd)

#                 base_name = os.path.splitext(os.path.basename(instance.logo.name))[0]

#                 if base_name.endswith("_optimized"):
#                      base_name = base_name.removesuffix("_optimized")
                
#                 new_name = f"{base_name}_optimized.jpg"
             

#                 new_full_path = os.path.join(os.path.dirname(img_path), new_name)
#                 os.replace(temp_path, new_full_path)

#                 if  os.path.exists(img_path) :
#                      os.remove(img_path)

            
#                 Company.objects.filter(id = instance.id).update(
#                      logo =  f"company_logos/{new_name}"
#                 )
                
            

#         except UnidentifiedImageError:
#             raise ValidationError("Uploaded file is not a valid image")
#         except Exception as e:
#             raise ValueError("error occured while proccessing Image?")

