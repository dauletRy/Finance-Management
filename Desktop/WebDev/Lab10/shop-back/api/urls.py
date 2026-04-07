from django.urls import path

from .views import (
    CategoryDetailAPIView,
    CategoryListAPIView,
    CategoryProductsAPIView,
    product_detail_view,
    product_list_view,
)

urlpatterns = [
    path("categories/", CategoryListAPIView.as_view(), name="categories"),
    path(
        "categories/<int:category_id>/",
        CategoryDetailAPIView.as_view(),
        name="category_detail",
    ),
    path(
        "categories/<int:category_id>/products/",
        CategoryProductsAPIView.as_view(),
        name="category_products",
    ),
    
    path("products/", product_list_view, name="products"),
    path("products/<int:product_id>/", product_detail_view, name="product_detail"),
]