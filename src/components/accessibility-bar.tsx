"use client";

export default function AccessibilityBar() {
  return (
    <div className="container-acess-geral">
      <div className="container-controle">
        <ul className="controle-esquerda">
          <li className="funcoes-controle esquerda">
            <a
              className="zero"
              onClick={() =>
                document
                  .getElementById("content")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-tooltip="Ir para conteúdo"
              accessKey="1"
            >
              Ir para conteúdo [1]
            </a>
          </li>
          <li className="funcoes-controle esquerda">
            <a
              onClick={() =>
                document
                  .getElementById("primary-menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-tooltip="Ir para menu"
              accessKey="2"
            >
              Ir para menu [2]
            </a>
          </li>
          <li className="funcoes-controle esquerda">
            <a
              onClick={() =>
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-tooltip="Ir para rodapé"
              accessKey="3"
            >
              Ir para rodapé [3]
            </a>
          </li>
        </ul>

        <ul className="controle-direita">
          <li>
            <a
              onClick={() => {
                /* Função para aumentar fonte */
              }}
              className="funcoes-controle tm-font"
              data-tooltip="Aumentar fonte"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7.75"
                  stroke="white"
                  strokeWidth="0.5"
                ></circle>
                <path
                  d="M5.45703 4.52051L3.10352 11H2.1416L4.85156 3.89062H5.47168L5.45703 4.52051ZM7.42969 11L5.07129 4.52051L5.05664 3.89062H5.67676L8.39648 11H7.42969ZM7.30762 8.36816V9.13965H3.31348V8.36816H7.30762ZM13.7773 7.18652V8.03613H8.9043V7.18652H13.7773ZM11.7949 5.11133V10.2871H10.8916V5.11133H11.7949Z"
                  fill="white"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                /* Função para diminuir fonte */
              }}
              className="funcoes-controle tm-font"
              data-tooltip="Diminuir fonte"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7.75"
                  stroke="white"
                  strokeWidth="0.5"
                ></circle>
                <path
                  d="M6.45703 4.52051L4.10352 11H3.1416L5.85156 3.89062H6.47168L6.45703 4.52051ZM8.42969 11L6.07129 4.52051L6.05664 3.89062H6.67676L9.39648 11H8.42969ZM8.30762 8.36816V9.13965H4.31348V8.36816H8.30762ZM12.0918 7.60645V8.34863H9.70898V7.60645H12.0918Z"
                  fill="white"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                /* Função para alto contraste */
              }}
              href="#"
              className="funcoes-controle"
              data-tooltip="Alto contraste"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8C16 3.58187 12.4184 0.000266667 8.00027 0H8C3.58187 0 0 3.58187 0 8C0 12.4181 3.58187 16 8 16H8.00027C12.4184 15.9997 16 12.4181 16 8ZM8 15.4667C7.93573 15.4667 7.87227 15.4635 7.808 15.4616C7.60853 14.3043 7.46693 11.4008 7.46693 8C7.46693 4.5992 7.60853 1.69573 7.808 0.5384C7.87227 0.536533 7.93573 0.533333 8 0.533333C12.124 0.533333 15.4667 3.87627 15.4667 8C15.4667 12.1237 12.124 15.4667 8 15.4667Z"
                  fill="white"
                ></path>
              </svg>
              <span className="text-header">Alto contraste</span>
            </a>
          </li>
          <li>
            <a
              id="google_translate_element"
              className="funcoes-controle"
              data-tooltip="Idioma"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.41667 8.49996C1.41667 12.4121 4.58788 15.5833 8.5 15.5833C12.4121 15.5833 15.5833 12.4121 15.5833 8.49996C15.5833 4.58783 12.4121 1.41663 8.5 1.41663C4.58788 1.41663 1.41667 4.58783 1.41667 8.49996Z"
                  stroke="white"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9.20834 1.45203C9.20834 1.45203 11.3333 4.24994 11.3333 8.49994C11.3333 12.7499 9.20834 15.5479 9.20834 15.5479M7.79167 15.5479C7.79167 15.5479 5.66667 12.7499 5.66667 8.49994C5.66667 4.24994 7.79167 1.45203 7.79167 1.45203M1.86292 10.9791H15.1371M1.86292 6.02078H15.1371"
                  stroke="white"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span>Idioma</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
