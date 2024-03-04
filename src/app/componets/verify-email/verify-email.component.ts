import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrl: "./verify-email.component.scss",
})
export class VerifyEmailComponent {
  public token: any;
  constructor(private route: ActivatedRoute, private cookie: CookieService) {}
  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token");
    alert(this.token);
    this.cookie.set("tes-verifikasi-anjing", this.token);
  }

  setCookie() {
    this.cookie.set("userid", "user");
    this.cookie.set("username", "jarjit");
  }

  getCookie() {
    console.log(this.cookie.get("userid"));
  }

  removeCookie() {
    this.cookie.delete("username");
  }

  removeAllCookie() {
    this.cookie.deleteAll();
  }
}
