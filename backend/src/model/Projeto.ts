export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class Projeto {

  private id?: number;
  private titulo: string;
  private descricao?: string;
  private participantes: Participant[] = [];

  constructor(titulo: string, descricao: string | undefined, creator: {id: string, name: string, email: string}, id?: number){
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.addParticipant(creator.id, creator.name, creator.email, "Gerente");
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

  public setTitulo(novoTitulo: string): void {
        if (!novoTitulo || novoTitulo.trim().length === 0) {
            throw new Error("O título do projeto não pode ser vazio.");
        }
        this.titulo = novoTitulo;
    }

    public setDescricao(novaDescricao: string): void {
        this.descricao = novaDescricao || ""; 
  }

  public addParticipant(id: string, name: string, email: string, role: string): void {
    if (!this.participantes.some(p => p.id === id)) {
        this.participantes.push({ id, name, email, role });
    }
  }
}
