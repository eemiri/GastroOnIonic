export class Betrieb {
    public Id: number;
    public Betriebsname: string;
    public Strasse: string;
    public Ort: string;
    public ShowDivider: boolean;
  
    constructor(BetriebsId:number, Betriebsname: string, Strasse: string, Ort: string, ShowDivider: boolean) {
      this.Id = BetriebsId;
      this.Betriebsname = Betriebsname;
      this.Strasse = Strasse;
      this.Ort = Ort;
      this.ShowDivider = ShowDivider;
    }
  }
  