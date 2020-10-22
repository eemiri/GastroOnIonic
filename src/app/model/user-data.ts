export class UserData {
    public benutzername: string;
    public name: string;
    public vorname: string;
    public passwort: string;
    public betriebsId: number;
    public betriebsname: string;
    public uuid: string;
    public deviceToken: string;
    public platform: string;
    public benutzer_id: number;
    public umbraco_user_id: number;
    public registriert_seit: Date;
    public letztes_login: Date;
    public online_status: boolean;
    public benutzer_id_crypted: string;
    public umbraco_user_id_crypted: string;
    public avatar: string;
  
    constructor(
      benutzername: string,
      betriebsId: number,
      passwort: string,
      betriebsname: string,
      uuid: string,
      deviceToken: string,
      platform: string
    ) {
      this.benutzername = benutzername;
      this.betriebsId = betriebsId;
      this.passwort = passwort;
      this.betriebsname = betriebsname;
      this.uuid = uuid;
      this.deviceToken = deviceToken;
      this.platform = platform;
    }
  
    setAdditionalUserDataInformation(
      benutzer_id: number,
      umbraco_user_id: number,
      vorname: string,
      name: string,
      registriert_seit: Date,
      letztes_login: Date,
      online_status: boolean,
      benutzer_id_crypted: string,
      umbraco_user_id_crypted: string,
      avatar: string
    ) {
      this.benutzer_id = benutzer_id;
      this.umbraco_user_id = umbraco_user_id;
      this.vorname = vorname;
      this.name = name;
      this.registriert_seit = registriert_seit;
      this.letztes_login = letztes_login;
      this.online_status = online_status;
      this.benutzer_id_crypted = benutzer_id_crypted;
      this.umbraco_user_id_crypted = umbraco_user_id_crypted;
      this.avatar = avatar;
    }
  }
  