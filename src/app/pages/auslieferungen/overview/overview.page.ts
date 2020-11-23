import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  preorderList:any =[
    {PreorderID:1, Status: 4, TotalPrice: 10.99, DeliveryAddressData: 'Riegelsbergerstraße 45, 66113 Saarbrücken', CustomerData: 'Günther Jauch', CustomerMessage: '1riegelsberger millionär'},
    {PreorderID:2, Status: 4, TotalPrice: 8.55, DeliveryAddressData: 'Saargemünderstraße 45, 66271 Kleinblittersdorf', CustomerData: 'Alexander Marcus', CustomerMessage: '2saargemünder yeah boiii'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Jenneweg 12, 66113 Saarbrücken', CustomerData: 'babaji', CustomerMessage: '3jenne besser oben als unten'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Malstatterstraße 1, 66117 Saarbrücken', CustomerData: 'maalstatt', CustomerMessage: 'peace'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Mainzerstraße 171, 66121 Saarbrücken', CustomerData: 'mainzer', CustomerMessage: 'hotel, trivago'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Europaallee 14, 66113 Saarbrücken', CustomerData: 'Europa', CustomerMessage: 'apo'}
  ];

  constructor() { }

  ngOnInit() {
  }

  openDetails(preorder){
    
  }
}
