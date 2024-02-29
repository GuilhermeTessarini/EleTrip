create table usuario(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nomeUsuario VARCHAR(255),
    emailUsuario VARCHAR(255),
    telefoneUsuario VARCHAR(15),
    dataNascimentoUsuario DATE,
    cpfUsuario VARCHAR(12),
    rgUsuario VARCHAR(10),
    generoUsuario INTEGER(11),
    senhaUsuario VARCHAR(255),
    cidadeUsuario VARCHAR(255),
    estadoUsuario VARCHAR(50),
    ruaUsuario VARCHAR(255),
    numeroUsuario INTEGER(20),
    bairroUsuario VARCHAR(255),
    numeroRegistroHabilitacao INTEGER(30),
    validadeHabilitacao DATE,
    cnhHabilitacao INTEGER(30),
    role VARCHAR(20),

    UNIQUE(cpfUsuario, rgUsuario, emailUsuario)
);

create table carroceria(
    idCarroceria INT PRIMARY KEY AUTO_INCREMENT,
    nomeCarroceria VARCHAR(255) NOT NULL ,

    UNIQUE(nomeCarroceria)
);

create table veiculo(
    idVeiculo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomeVeiculo VARCHAR(255) NOT NULL,
    anoVeiculo INTEGER(4) NOT NULL,
    autonomiaVeiculo INTEGER(4) NOT NULL,
    marcaVeiculo VARCHAR(255) NOT NULL,
    passageirosVeiculo INTEGER(4) NOT NULL,
    placaVeiculo VARCHAR(50) NOT NULL,
    corVeiculo VARCHAR(255) NOT NULL,
    motorVeiculo VARCHAR(255) NOT NULL,
    valorLocacao INTEGER(100) NOT NULL,
    dataLocacao DATE NOT NULL,
    dataDevolucaoLocacao DATE NOT NULL,
    carroceriaId INT NOT NULL,
    imagemVeiculo BLOB NOT NULL,
    statusVeiculo VARCHAR(255)
);

create table fatura(
    idFatura INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    uuidFatura VARCHAR(200) NOT NULL,
    nomeFatura VARCHAR(255) NOT NULL,
    emailFatura VARCHAR(255) NOT NULL,
    telefoneFatura VARCHAR (20) NOT NULL,
    metodoPagamentoFatura VARCHAR(50) NOT NULL,
    totalFatura INT NOT NULL,
    veiculoDetalhe JSON DEFAULT NULL,
    criadoPor VARCHAR(255) NOT NULL
);