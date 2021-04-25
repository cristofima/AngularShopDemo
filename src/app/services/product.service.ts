import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getProducts(){
    return this.httpClient.get<ProductModel[]>(environment.baseUrl+"/products");
  }

  addProduct(payload: any){
    return this.httpClient.post<ProductModel>(environment.baseUrl+"/products", payload);
  }

  updateProduct(payload: any){
    return this.httpClient.put<ProductModel>(environment.baseUrl+"/products/"+payload.productId, payload);
  }

  deleteProduct(productId: number){
    return this.httpClient.delete(environment.baseUrl+"/products/"+productId);
  }
}
