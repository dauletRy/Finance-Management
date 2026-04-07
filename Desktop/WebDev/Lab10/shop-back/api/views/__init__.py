
from .generics import (
    CategoryDetailAPIView,
    CategoryListAPIView,
    CategoryProductsAPIView,
)


#from .fbv import products_list as product_list_view
#from .fbv import product_detail as product_detail_view


#from .cbv import ProductListAPIView, ProductDetailAPIView
#product_list_view = ProductListAPIView.as_view()
#product_detail_view = ProductDetailAPIView.as_view()


#from .mixins import ProductListAPIView, ProductDetailAPIView
#product_list_view = ProductListAPIView.as_view()
#product_detail_view = ProductDetailAPIView.as_view()

from .generics import ProductListAPIView, ProductDetailAPIView
product_list_view = ProductListAPIView.as_view()
product_detail_view = ProductDetailAPIView.as_view()