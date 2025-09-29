export class Projeto {
  private id?: number;
  private titulo: string;
  private descricao?: string;
  private participantes: Map<string, string> = new Map();

  constructor(titulo: string, descricao: string | undefined, creatorId: string, id?: number) { // 👈 ADICIONADO
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.participantes.set(creatorId, "Gerente");
  }

  public getId() {
    return this.id;
  }


  public getTitulo() {
    return this.titulo;
  }

  public getDescricao() {
    return this.descricao;
  }

  public getParticipantes() {
    return this.participantes;
  }
}
