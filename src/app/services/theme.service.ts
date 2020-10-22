import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';

interface Theme {
  Name: string;
  Styles: Array<ThemeStyle>;
}
interface ThemeStyle {
  Variable: string;
  Value: string;
}
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: Array<Theme>;
  private currentThemeIndex: number = 0;

  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document) { 
    this.themes = new Array<Theme>({
      Name: 'day',
      Styles: [
        { Variable: '--ion-color-primary', Value: '#f8383a'},
        { Variable: '--ion-color-primary-rgb', Value: '248,56,58'},
        { Variable: '--ion-color-primary-contrast', Value: '#ffffff'},
        { Variable: '--ion-color-primary-contrast-rgb', Value: '255,255,255'},
        { Variable: '--ion-color-primary-shade', Value: '#da3133'},
        { Variable: '--ion-color-primary-tint', Value: '#f94c4e'},
        { Variable: '--ion-item-ios-background-color', Value: '#ffffff'},
        { Variable: '--ion-item-md-background-color', Value: '#ffffff'},
        { Variable: '--ion-tabbar-background-color', Value: '#fff'},
        { Variable: '--ion-tabbar-ios-text-color-active', Value: '#000000'},
        { Variable: '--ion-tabbar-md-text-color-active', Value: '#000000'},
        { Variable: '--ion-background-color', Value: '#f94c4e'}
      ]
    },
    {
      Name: 'night',
      Styles: [
        { Variable: '--ion-color-primary', Value: '#222428'},
        { Variable: '--ion-color-primary-rgb', Value: '34,34,34'},
        { Variable: '--ion-color-primary-contrast', Value: '#ffffff'},
        { Variable: '--ion-color-primary-contrast-rgb', Value: '255,255,255'},
        { Variable: '--ion-color-primary-shade', Value: '#1e2023'},
        { Variable: '--ion-color-primary-tint', Value: '#383a3e'},
        { Variable: '--ion-item-ios-background-color', Value: '#717171'},
        { Variable: '--ion-item-md-background-color', Value: '#717171'},
        { Variable: '--ion-tabbar-background-color', Value: '#222428'},
        { Variable: '--ion-tabbar-ios-text-color-active', Value: '#ffffff'},
        { Variable: '--ion-tabbar-md-text-color-active', Value: '#ffffff'},
        { Variable: '--ion-background-color', Value: '#383838'}
      ]
    });
  }


  public CycleThemes(): void {
    if(this.themes.length > this.currentThemeIndex + 1){
      this.currentThemeIndex++;
    }
    else {
      this.currentThemeIndex =  0;
    }
    this.SetTheme(this.themes[this.currentThemeIndex]); 
  }


  public SetTheme(theme: Theme): void{
    this.domCtrl.write(() => {
      theme.Styles.forEach(style => {
        this.document.documentElement.style.setProperty(style.Variable, style.Value);
      });
    });
  }
}
