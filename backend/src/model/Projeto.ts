import { Uuid } from "./Uuid";

export class Projeto {
  private titulo: string;
  private descricao?: string;
  private participantes: Map<Uuid, string> = new Map();

  constructor(titulo: string, descricao: string | undefined, creatorId: Uuid) {
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
