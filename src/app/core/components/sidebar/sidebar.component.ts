import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService // private toastr: ToastrService
  ) {}
  allMenu: any[] = [
    {
      title: 'My SmartScribbl',
      link: '/main/dashboard',
      // roles: [UserRole.superAdmin],
      icon: this.sanitizer
        .bypassSecurityTrustHtml(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.068 16.8173C17.9618 16.9233 17.8775 17.0492 17.82 17.1878C17.7625 17.3264 17.7329 17.475 17.7329 17.6251C17.7329 17.7751 17.7625 17.9237 17.82 18.0623C17.8775 18.201 17.9618 18.3269 18.068 18.4329C18.1852 18.5502 18.2511 18.7092 18.2511 18.8751C18.2511 19.0409 18.1852 19.2 18.068 19.3173C17.9507 19.4345 17.7916 19.5004 17.6258 19.5004C17.4599 19.5004 17.3009 19.4345 17.1836 19.3173C16.735 18.8684 16.4829 18.2597 16.4829 17.6251C16.4829 16.9904 16.735 16.3818 17.1836 15.9329L17.9164 15.2009C18.1308 14.9861 18.251 14.695 18.2507 14.3915C18.2504 14.0881 18.1296 13.7972 17.9148 13.5829C17.7001 13.3685 17.409 13.2483 17.1055 13.2486C16.8021 13.2489 16.5112 13.3697 16.2969 13.5844L11.0844 18.7969C10.63 19.215 10.0316 19.4413 9.41432 19.4285C8.797 19.4157 8.20853 19.1647 7.77193 18.7281C7.33533 18.2915 7.08438 17.7031 7.07156 17.0858C7.05874 16.4684 7.28503 15.8701 7.70313 15.4157L15.4156 7.7032C15.5219 7.59691 15.6062 7.47072 15.6638 7.33185C15.7213 7.19298 15.7509 7.04414 15.7509 6.89382C15.7509 6.74351 15.7213 6.59466 15.6638 6.45579C15.6062 6.31692 15.5219 6.19073 15.4156 6.08445C15.3093 5.97816 15.1832 5.89384 15.0443 5.83632C14.9054 5.7788 14.7566 5.74919 14.6063 5.74919C14.4559 5.74919 14.3071 5.7788 14.1682 5.83632C14.0293 5.89384 13.9032 5.97816 13.7969 6.08445L8.58438 11.2969C8.13002 11.715 7.53164 11.9413 6.91432 11.9285C6.297 11.9157 5.70853 11.6647 5.27193 11.2281C4.83533 10.7915 4.58438 10.2031 4.57156 9.58575C4.55874 8.96843 4.78503 8.37005 5.20313 7.9157L8.43281 4.68288C8.55009 4.56571 8.70911 4.49993 8.87489 4.5C9.04067 4.50007 9.19963 4.566 9.3168 4.68327C9.43397 4.80055 9.49976 4.95957 9.49968 5.12535C9.49961 5.29113 9.43368 5.45009 9.31641 5.56726L6.0836 8.79695C5.86894 9.01171 5.74838 9.30295 5.74846 9.6066C5.74853 9.91025 5.86922 10.2014 6.08399 10.4161C6.29875 10.6307 6.58999 10.7513 6.89364 10.7512C7.19729 10.7512 7.48847 10.6305 7.70313 10.4157L12.9156 5.2032C13.37 4.7851 13.9684 4.55881 14.5857 4.57163C15.203 4.58445 15.7915 4.8354 16.2281 5.272C16.6647 5.7086 16.9156 6.29707 16.9284 6.91439C16.9413 7.53171 16.715 8.13009 16.2969 8.58445L8.58438 16.2969C8.36972 16.5116 8.24912 16.8027 8.24912 17.1063C8.24912 17.4099 8.36972 17.701 8.58438 17.9157C8.79904 18.1304 9.09018 18.2509 9.39375 18.2509C9.69733 18.2509 9.98847 18.1304 10.2031 17.9157L15.4156 12.7032C15.87 12.2851 16.4684 12.0588 17.0857 12.0716C17.703 12.0845 18.2915 12.3354 18.7281 12.772C19.1647 13.2086 19.4156 13.7971 19.4284 14.4144C19.4413 15.0317 19.215 15.6301 18.7969 16.0844L18.068 16.8173Z" fill="#52525B"/>
</svg>
`),
    },
    {
      title: 'Bin',
      link: '/main/dashboard',
      // roles: [
      //   UserRole.superAdmin,
      //   UserRole.superModerator,
      //   UserRole.contentModerator,
      // ],
      icon: this.sanitizer.bypassSecurityTrustHtml(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 19C18 19.7956 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7956 22 15 22H8C7.20435 22 6.44129 21.6839 5.87868 21.1213C5.31607 20.5587 5 19.7956 5 19V7H4V4H8.5L9.5 3H13.5L14.5 4H19V7H18V19ZM6 7V19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7H6ZM18 6V5H14L13 4H10L9 5H5V6H18ZM8 9H9V19H8V9ZM14 9H15V19H14V9Z" fill="#52525B"/>
</svg>

`),
    },
    {
      title: 'Account',
      link: '/main/dashboard',
      // roles: [UserRole.superAdmin, UserRole.superModerator],
      icon: this.sanitizer.bypassSecurityTrustHtml(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10Z" stroke="#52525B"/>
<path d="M20 17.5C20 19.985 20 22 12 22C4 22 4 19.985 4 17.5C4 15.015 7.582 13 12 13C16.418 13 20 15.015 20 17.5Z" stroke="#52525B"/>
</svg>
          `),
    },
    {
      title: 'Apps',
      link: '/main/dashboard',
      // roles: [UserRole.superAdmin, UserRole.superModerator],
      icon: this.sanitizer.bypassSecurityTrustHtml(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H6C6.26522 3 6.51957 3.10536 6.70711 3.29289C6.89464 3.48043 7 3.73478 7 4V6C7 6.26522 6.89464 6.51957 6.70711 6.70711C6.51957 6.89464 6.26522 7 6 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6V4ZM3 18C3 17.7348 3.10536 17.4804 3.29289 17.2929C3.48043 17.1054 3.73478 17 4 17H6C6.26522 17 6.51957 17.1054 6.70711 17.2929C6.89464 17.4804 7 17.7348 7 18V20C7 20.2652 6.89464 20.5196 6.70711 20.7071C6.51957 20.8946 6.26522 21 6 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V18ZM18 3C17.7348 3 17.4804 3.10536 17.2929 3.29289C17.1054 3.48043 17 3.73478 17 4V6C17 6.26522 17.1054 6.51957 17.2929 6.70711C17.4804 6.89464 17.7348 7 18 7H20C20.2652 7 20.5196 6.89464 20.7071 6.70711C20.8946 6.51957 21 6.26522 21 6V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H18ZM17 11C17 10.7348 17.1054 10.4804 17.2929 10.2929C17.4804 10.1054 17.7348 10 18 10H20C20.2652 10 20.5196 10.1054 20.7071 10.2929C20.8946 10.4804 21 10.7348 21 11V13C21 13.2652 20.8946 13.5196 20.7071 13.7071C20.5196 13.8946 20.2652 14 20 14H18C17.7348 14 17.4804 13.8946 17.2929 13.7071C17.1054 13.5196 17 13.2652 17 13V11ZM11 10C10.7348 10 10.4804 10.1054 10.2929 10.2929C10.1054 10.4804 10 10.7348 10 11V13C10 13.2652 10.1054 13.5196 10.2929 13.7071C10.4804 13.8946 10.7348 14 11 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V11C14 10.7348 13.8946 10.4804 13.7071 10.2929C13.5196 10.1054 13.2652 10 13 10H11ZM3 11C3 10.7348 3.10536 10.4804 3.29289 10.2929C3.48043 10.1054 3.73478 10 4 10H6C6.26522 10 6.51957 10.1054 6.70711 10.2929C6.89464 10.4804 7 10.7348 7 11V13C7 13.2652 6.89464 13.5196 6.70711 13.7071C6.51957 13.8946 6.26522 14 6 14H4C3.73478 14 3.48043 13.8946 3.29289 13.7071C3.10536 13.5196 3 13.2652 3 13V11ZM11 3C10.7348 3 10.4804 3.10536 10.2929 3.29289C10.1054 3.48043 10 3.73478 10 4V6C10 6.26522 10.1054 6.51957 10.2929 6.70711C10.4804 6.89464 10.7348 7 11 7H13C13.2652 7 13.5196 6.89464 13.7071 6.70711C13.8946 6.51957 14 6.26522 14 6V4C14 3.73478 13.8946 3.48043 13.7071 3.29289C13.5196 3.10536 13.2652 3 13 3H11ZM10 18C10 17.7348 10.1054 17.4804 10.2929 17.2929C10.4804 17.1054 10.7348 17 11 17H13C13.2652 17 13.5196 17.1054 13.7071 17.2929C13.8946 17.4804 14 17.7348 14 18V20C14 20.2652 13.8946 20.5196 13.7071 20.7071C13.5196 20.8946 13.2652 21 13 21H11C10.7348 21 10.4804 20.8946 10.2929 20.7071C10.1054 20.5196 10 20.2652 10 20V18ZM18 17C17.7348 17 17.4804 17.1054 17.2929 17.2929C17.1054 17.4804 17 17.7348 17 18V20C17 20.2652 17.1054 20.5196 17.2929 20.7071C17.4804 20.8946 17.7348 21 18 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V18C21 17.7348 20.8946 17.4804 20.7071 17.2929C20.5196 17.1054 20.2652 17 20 17H18Z" fill="#52525B"/>
</svg>

`),
    },
    {
      title: 'Support',
      link: '/main/dashboard',
      // roles: [
      //   UserRole.superAdmin,
      //   UserRole.superModerator,
      //   UserRole.contentModerator,
      // ],
      icon: this.sanitizer.bypassSecurityTrustHtml(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.9999 10.8049C16.9999 10.4589 16.9999 10.2859 17.0519 10.1319C17.2029 9.68388 17.6019 9.51088 18.0019 9.32888C18.4499 9.12388 18.6739 9.02188 18.8969 9.00388C19.1489 8.98388 19.4019 9.03788 19.6179 9.15888C19.9039 9.31888 20.1039 9.62488 20.3079 9.87288C21.2509 11.0189 21.7229 11.5919 21.8949 12.2229C22.0349 12.7329 22.0349 13.2669 21.8949 13.7759C21.6439 14.6979 20.8489 15.4699 20.2599 16.1859C19.9589 16.5509 19.8079 16.7339 19.6179 16.8409C19.3982 16.9627 19.1473 17.0167 18.8969 16.9959C18.6739 16.9779 18.4499 16.8759 18.0009 16.6709C17.6009 16.4889 17.2029 16.3159 17.0519 15.8679C16.9999 15.7139 16.9999 15.5409 16.9999 15.1949V10.8049ZM6.99991 10.8049C6.99991 10.3689 6.98791 9.97788 6.63591 9.67188C6.50791 9.56088 6.33791 9.48388 5.99891 9.32888C5.54991 9.12488 5.32591 9.02188 5.10291 9.00388C4.43591 8.94988 4.07691 9.40588 3.69291 9.87388C2.74891 11.0189 2.27691 11.5919 2.10391 12.2239C1.96471 12.7322 1.96471 13.2686 2.10391 13.7769C2.35591 14.6979 3.15191 15.4709 3.73991 16.1859C4.11091 16.6359 4.46591 17.0469 5.10291 16.9959C5.32591 16.9779 5.54991 16.8759 5.99891 16.6709C6.33891 16.5169 6.50791 16.4389 6.63591 16.3279C6.98791 16.0219 6.99991 15.6309 6.99991 15.1959V10.8049Z" stroke="#52525B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 9C5 5.686 8.134 3 12 3C15.866 3 19 5.686 19 9M19 17V17.8C19 19.567 17.21 21 15 21H13" stroke="#52525B" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`),
    },
  ];

  routes: any[] = [];
  user: any;

  ngOnInit() {
    this.routes = this.allMenu;
    // this.routes = this.allMenu.filter((route) =>
    //   route.roles.includes(this.authService.getRole())
    // );
    // this.user = this.authService.getUser();
  }

  caughtUs() {
    // this.toastr.info(
    //   'Ooooops! you caught us, we are working on this page.',
    //   'Info'
    // );
  }

  onLogout() {
    // this.authService.logout();
  }
}
