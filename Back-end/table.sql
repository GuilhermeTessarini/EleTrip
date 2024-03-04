CREATE TABLE `carroceria` (
  `idCarroceria` int(11) NOT NULL AUTO_INCREMENT,
  `nomeCarroceria` varchar(255) NOT NULL,
  PRIMARY KEY (`idCarroceria`),
  UNIQUE KEY `nomeCarroceria` (`nomeCarroceria`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `fatura` (
  `idFatura` int(11) NOT NULL AUTO_INCREMENT,
  `uuidFatura` varchar(200) NOT NULL,
  `nomeFatura` varchar(255) NOT NULL,
  `emailFatura` varchar(255) NOT NULL,
  `telefoneFatura` varchar(20) NOT NULL,
  `metodoPagamentoFatura` varchar(50) NOT NULL,
  `totalFatura` int(11) NOT NULL,
  `veiculoDetalhe` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`veiculoDetalhe`)),
  `criadoPor` varchar(255) NOT NULL,
  `dataRetirada` date DEFAULT NULL,
  `dataRetorno` date DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`idFatura`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `nomeUsuario` varchar(255) NOT NULL,
  `emailUsuario` varchar(255) NOT NULL,
  `telefoneUsuario` varchar(15) NOT NULL,
  `dataNascimentoUsuario` date NOT NULL,
  `cpfUsuario` varchar(12) NOT NULL,
  `rgUsuario` varchar(10) NOT NULL,
  `generoUsuario` int(11) NOT NULL,
  `senhaUsuario` varchar(255) NOT NULL,
  `cidadeUsuario` varchar(255) NOT NULL,
  `estadoUsuario` varchar(50) NOT NULL,
  `ruaUsuario` varchar(255) NOT NULL,
  `numeroUsuario` int(20) NOT NULL,
  `bairroUsuario` varchar(255) NOT NULL,
  `numeroRegistroHabilitacao` varchar(25) NOT NULL,
  `validadeHabilitacao` date NOT NULL,
  `cnhHabilitacao` varchar(25) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `cpfUsuario` (`cpfUsuario`,`rgUsuario`,`emailUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `veiculo` (
  `idVeiculo` int(11) NOT NULL AUTO_INCREMENT,
  `nomeVeiculo` varchar(255) NOT NULL,
  `anoVeiculo` int(4) NOT NULL,
  `autonomiaVeiculo` int(4) NOT NULL,
  `marcaVeiculo` varchar(255) NOT NULL,
  `passageirosVeiculo` int(4) NOT NULL,
  `placaVeiculo` varchar(50) NOT NULL,
  `corVeiculo` varchar(255) NOT NULL,
  `motorVeiculo` varchar(255) NOT NULL,
  `valorLocacao` int(100) NOT NULL,
  `carroceriaId` int(11) NOT NULL,
  `imagemVeiculo` varchar(255) NOT NULL,
  `statusVeiculo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idVeiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;