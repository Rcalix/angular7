import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProductModel } from '../ProductModel';
import { ProductService } from '../product.service';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  
  userIsAuthenticated = false;
  role = '';
  private authListenerSubs: Subscription;
  products: ProductModel[];

  constructor(private productService: ProductService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.role = this.authService.getRole();
    console.log(this.role);
    this.getAllProducts();
  }

  
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(data=>{
      this.products = data;
    });
  };

  addProduct(): void {
    this.router.navigate(['add-product']);
  }

  deleteProduct(product: ProductModel){
    
    this.productService.deleteProduct(product._id).subscribe(data=>{
      console.log(data);
      this.getAllProducts();
    });
  }

  updateProduct(product: ProductModel){
    localStorage.removeItem("productId");
    localStorage.setItem("productId", product._id);
    this.router.navigate(['edit-product']);
  }

}
