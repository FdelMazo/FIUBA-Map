// TODO: hacer un UserLogin padre y derivarlo con el de types/User.ts
export interface UserMapLogin {
  carreraid: string;
  map: string;
}

export interface AliasMateriasFIUBARepos {
  [key: string]: string;
}

export interface MateriaFIUBARepo {
  nombre: string;
  codigos: string[];
  reponames?: Set<string>;
}

// Creo que no hace falta implementar todas las propiedades (son muchas),
// solamente las que se utilicen en la app
export interface GithubSearchRepo {
  [key: string]: any;
  topics: string[];
}

export interface GithubSearchRepoJSON {
  items: GithubSearchRepo[];
  [key: string]: any;
}