import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';

  interface Food {
    value: string;
    viewValue: string;
  }

  @Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
  })

export class DialogComponent implements OnInit {

  actionBtn : string = "Save";
  productForm !: FormGroup;
  durationInSeconds = 5;

  @Input() nome: string = '';
  @Input() placeholder: string = '';

  constructor( private formBuilder : FormBuilder, private api : ApiService, @Inject(MAT_DIALOG_DATA) public editData : any, private dialogRef : MatDialogRef<DialogComponent>, private snack : MatSnackBar , ) {}

  foods: Food[] = [
    {value: 'Iphone 11', viewValue: 'Iphone 11'},
    {value: 'MacBook M2', viewValue: 'MacBook M2'},
    {value: 'AirPods', viewValue: 'AirPods'},
  ]

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      productType : ['', Validators.required],
      productDate : ['', Validators.required],
      productDescription : ['', Validators.required],
    })

    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['productType'].setValue(this.editData.productType);
      this.productForm.controls['productDate'].setValue(this.editData.productDate);
      this.productForm.controls['productDescription'].setValue(this.editData.productDescription);
    }
  }

  addProduct(){
   if(!this.editData){
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next:(res)=>{
          this.snack.open('Product Saved')
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert("Error")
        }
      })
    }
   }else{
      this.updateProduct()
   }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        this.snack.open('Product updated'),
        this.productForm.reset();
        this.dialogRef.close('update')
      },
      error:()=>{
        this.snack.open('Error While Updating')
      }
    })
  }
}




