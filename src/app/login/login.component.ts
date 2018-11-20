import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // 表单
  public myFromModule: FormGroup;
  public formUsername: any;
  public formPassword: any;
  constructor(
    private fb: FormBuilder,
    private route: Router
  ) { }

  ngOnInit() {
    this.myFromModule = this.fb.group({
      username: ['', [Validators.required]],
      password: ['' , [Validators.required]]
    });
    this.formUsername = this.myFromModule.get('username');
    this.formPassword = this.myFromModule.get('password');
  }

//  登陆
  public onSubmit() {
    this.route.navigate(['/home/main']);
    if (this.myFromModule.valid) {
      console.log(this.myFromModule.value);
      this.myFromModule.reset({
        username: '',
        password: ''
      });
      /*this.loginService.getLogin(this.myFromModule.value).subscribe((data) => {
        if (data.success) {
          // 本地存储信息
          for ( const i in data.obj) {
            if (data.obj.hasOwnProperty(i)) {
              this.localSessionStorage.set(i, data.obj[i]);
            }
          }
          this.router.navigate(['/home']);
        } else {
          this.loginSuccess = data.success;
          this.loginMsg = data.msg;
          window.alert(this.loginMsg);
        }
      });*/
    } else {
      window.alert('请输入合法的用户名和密码');
    }
  }
}
