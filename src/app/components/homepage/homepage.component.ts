import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/products';
import { FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  products: Product[];
  editForm: FormGroup;
  page: number = 1;

  submitted: boolean = false;

  constructor(private productservice: ProductService, private router: Router) { }

  ngOnInit() {
    this.productservice.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  deleteProduct(product: Product): void {
    let result = confirm("Are you sure you want to delete this product?")
    if (result) {
      this.productservice.deleteProduct(product.id).subscribe(data => {
        this.products = this.products.filter(u => u !== product);
      })
    }
  }

  deleteAllProduct(product: Product[]): void {
    let result = confirm("Are you sure you want to delete all products?")
    if (result) {
      for (let prod of product) {
        this.productservice.deleteProduct(prod.id).subscribe(data => {
          this.products = this.products.filter(u => u !== prod);
        });
      }
      window.location.reload();
    }
  }

  addProduct(): void {
    this.router.navigate(['/addproduct']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }

    this.productservice.updateProduct(this.editForm.value)
      .subscribe(
        data => {
          this.router.navigate(['/homepage']);
        },
        error => {
          alert(error);
        });
  }

  editProduct(product: Product): void {
    localStorage.removeItem("EditProductId");
    localStorage.setItem("EditProductId", product.id.toString());
    this.router.navigate(['/editproduct']);
  };

}