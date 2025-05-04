// Tipos de la API de Google Sheet

export namespace GoogleSheetAPI {
  // Fuente: https://developers.google.com/sheets/api/reference/rest/v4/Dimension
  // FIXME: Capaz no haga falta especificar majorDimensionEnum si no se utiliza?
  enum majorDimensionEnum {
    DIMENSION_UNSPECIFIED = "DIMENSION_UNSPECIFIED",
    ROWS = "ROWS",
    COLUMNS = "COLUMNS",
  }

  // Fuente: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet
  export interface BatchGet {
    spreadsheetId: string;
    valueRanges: UserValueRange[];
  }

  // Fuente: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
  interface ValueRange {
    range: string;
    majorDimension: majorDimensionEnum;
    error: string | undefined; // Nose como sera el error en google sheets api
  }

  export interface UserValueRange extends ValueRange {
    values: [string[]];
  }

  export interface RegistrosValueRange extends ValueRange {
    values: {
      string: string[];
      [Symbol.iterator](): Iterator<string[]>;
    };
  }
}
