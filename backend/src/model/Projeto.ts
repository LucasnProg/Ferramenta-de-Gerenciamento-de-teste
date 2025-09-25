export class Projeto {
  private titulo: string;
  private descricao?: string;
  private participantes: Map<string, string> = new Map();

  constructor(titulo: string, descricao: string | undefined, creatorId: string) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.participantes.set(creatorId, "Gerente");
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
