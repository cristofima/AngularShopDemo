import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: ProductModel[];
  displayDialog: boolean;
  formGroup: FormGroup;
  productIdToSave: number;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res =>{
      this.products = res;
    });

    this.buildForm();
  }

  private buildForm(){
    this.formGroup = this.formBuilder.group({
      name: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      price: new FormControl(null, Validators.compose([Validators.required, Validators.min(0.01)])),
      stock: new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
      enabled: new FormControl(false),
      expirationDate: new FormControl(null, Validators.compose([Validators.required])),
      description: new FormControl(null)
    });
  }

  openDialog(product?: ProductModel){
    this.displayDialog = true;
    this.productIdToSave = product ? product.productId : null;

    if(product){
      this.formGroup.controls["name"].setValue(product ? product.name : null);
      this.formGroup.controls["price"].setValue(product ? product.price : null);
      this.formGroup.controls["stock"].setValue(product ? product.stock : null);
      this.formGroup.controls["enabled"].setValue(product ? product.enabled : false);
      this.formGroup.controls["description"].setValue(product ? product.description : null);
      this.formGroup.controls["expirationDate"].setValue(product ? new Date(product.expirationDate) : null);
    }else{
      this.formGroup.reset();
    }
  }

  saveProduct(){
    if(!this.productIdToSave){
      let payload: ProductModel = {
        ...this.formGroup.value
      };

      this.productService.addProduct(payload).subscribe(res =>{
        this.products.push(res);
        this.displayDialog = false;
        this.messageService.add({severity:'success', detail:'Producto "'+payload.name+'" agregado'});
      });
    }else{
      let payload: ProductModel = {
        ...this.formGroup.value,
        productId: this.productIdToSave
      };

      this.productService.updateProduct(payload).subscribe(res =>{
        let index = this.products.findIndex(x => x.productId == this.productIdToSave);
        if(index >= 0){
          this.products[index] = res;
        }

        this.displayDialog = false;
        this.messageService.add({severity:'success', detail:'Producto actualizado'});
      });
    }
  }

  deleteProduct(product: ProductModel){
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar el producto "'+product.name+'"?',
      acceptLabel: "Si",
      accept: () => {
        this.productService.deleteProduct(product.productId).subscribe(()=>{
          this.products = this.products.filter(x => x.productId != product.productId);
          this.messageService.add({severity:'success', detail:'Producto "'+product.name+'" eliminado'});
        });
      }
  });
  }

}
