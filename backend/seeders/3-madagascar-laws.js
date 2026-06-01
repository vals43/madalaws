'use strict';

module.exports = {
  up: async (queryInterface) => {
    const { v4: uuidv4 } = require('uuid');

    // Code: Code du Travail de Madagascar
    const codeTravailId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeTravailId,
      name: 'Code du Travail',
      description: 'Loi n°2024-014 portant Code du travail à Madagascar',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Code du Travail 2024
    const bookTravailId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookTravailId,
      codeId: codeTravailId,
      title: 'Code du Travail 2024',
      number: '2024-014',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Titres
    const title1Id = uuidv4();
    const title2Id = uuidv4();
    const title3Id = uuidv4();

    await queryInterface.bulkInsert('titles', [
      { id: title1Id, bookId: bookTravailId, title: 'Dispositions Générales', number: 'I', createdAt: new Date(), updatedAt: new Date() },
      { id: title2Id, bookId: bookTravailId, title: 'Du Contrat de Travail', number: 'II', createdAt: new Date(), updatedAt: new Date() },
      { id: title3Id, bookId: bookTravailId, title: 'Des Conditions de Travail', number: 'III', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Chapitres
    const chap1Id = uuidv4();
    const chap2Id = uuidv4();

    await queryInterface.bulkInsert('chapters', [
      { id: chap1Id, titleId: title1Id, title: 'Du champ d\'application', number: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: chap2Id, titleId: title2Id, title: 'De la formation du contrat', number: '1', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Sections
    const sect1Id = uuidv4();

    await queryInterface.bulkInsert('sections', [
      { id: sect1Id, chapterId: chap1Id, title: 'Employeurs et travailleurs', number: '1', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Articles
    await queryInterface.bulkInsert('articles', [
      { id: uuidv4(), sectionId: sect1Id, chapterId: null, number: '1', content: 'La présente loi est applicable à tout employeur et à tout travailleur dont le contrat de travail, quels que soient sa forme, le lieu de sa conclusion et la résidence de l\'une ou de l\'autre partie, est exécuté à Madagascar.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sectionId: sect1Id, chapterId: null, number: '2', content: 'Elle détermine les règles et principes applicables en matière de relations de travail individuelles aussi bien que collectives.', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Code: Loi sur les Investissements
    const codeInvId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeInvId,
      name: 'Loi sur les Investissements',
      description: 'Loi n°2023-002 sur les Investissements à Madagascar',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Loi Investissement 2023
    const bookInvId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookInvId,
      codeId: codeInvId,
      title: 'Loi sur les Investissements 2023',
      number: '2023-002',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Titre
    const titleInv1Id = uuidv4();
    await queryInterface.bulkInsert('titles', [{
      id: titleInv1Id,
      bookId: bookInvId,
      title: 'Dispositions Générales',
      number: 'I',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Article
    await queryInterface.bulkInsert('articles', [{
      id: uuidv4(),
      sectionId: null,
      chapterId: null,
      number: '1',
      content: 'La présente loi régit les investissements à Madagascar, définit les droits et obligations des investisseurs, et institue un régime d\'incitations et de garanties.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Code: Loi sur la Concurrence
    const codeConcId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeConcId,
      name: 'Loi sur la Concurrence',
      description: 'Loi n°2018-020 portant refonte de la loi sur la concurrence',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Loi Concurrence 2018
    const bookConcId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookConcId,
      codeId: codeConcId,
      title: 'Loi sur la Concurrence 2018',
      number: '2018-020',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Article
    await queryInterface.bulkInsert('articles', [{
      id: uuidv4(),
      sectionId: null,
      chapterId: null,
      number: '1',
      content: 'La présente loi a pour objet de promouvoir et de protéger la concurrence libre et non faussée sur le territoire de la République de Madagascar.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Code: Loi sur la Lutte contre la Corruption
    const codeCorrId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeCorrId,
      name: 'Loi sur la Lutte contre la Corruption',
      description: 'Loi n°2004-030 du 09 septembre 2004 sur la lutte contre la corruption',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Loi Corruption 2004
    const bookCorrId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookCorrId,
      codeId: codeCorrId,
      title: 'Loi sur la Lutte contre la Corruption 2004',
      number: '2004-030',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Article
    await queryInterface.bulkInsert('articles', [{
      id: uuidv4(),
      sectionId: null,
      chapterId: null,
      number: '14',
      content: 'Toute personne qui, de bonne foi, signale ou dénonce un acte de corruption est protégée par la loi. La divulgation d\'informations relatives à des faits de corruption ne peut donner lieu à des sanctions disciplinaires ou pénales.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Code: Loi sur les Zones Franches (ZEF)
    const codeZefId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeZefId,
      name: 'Loi sur les Zones Franches',
      description: 'Loi n°2007-037 du 14 janvier 2008 sur les Zones et Entreprises Franches à Madagascar',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Loi ZEF 2007
    const bookZefId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookZefId,
      codeId: codeZefId,
      title: 'Loi sur les Zones Franches 2007',
      number: '2007-037',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Article
    await queryInterface.bulkInsert('articles', [{
      id: uuidv4(),
      sectionId: null,
      chapterId: null,
      number: '1',
      content: 'La présente loi définit le régime juridique des Zones et Entreprises Franches à Madagascar, afin de promouvoir l\'investissement, l\'emploi et l\'exportation.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Code: Charte de l'Environnement
    const codeEnvId = uuidv4();
    await queryInterface.bulkInsert('codes', [{
      id: codeEnvId,
      name: 'Charte de l\'Environnement',
      description: 'Loi n°90-033 du 21 décembre 1990 et Loi n°97-012 du 06 juin 1997',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Book: Charte Environnement
    const bookEnvId = uuidv4();
    await queryInterface.bulkInsert('books', [{
      id: bookEnvId,
      codeId: codeEnvId,
      title: 'Charte de l\'Environnement',
      number: '90-033/97-012',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Article
    await queryInterface.bulkInsert('articles', [{
      id: uuidv4(),
      sectionId: null,
      chapterId: null,
      number: '1',
      content: 'L\'environnement est défini comme l\'ensemble des milieux naturels, artificiels, humains, ainsi que les facteurs sociaux et culturels influençant le développement national. La protection de l\'environnement est une priorité pour l\'État.',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('articles', null, {});
    await queryInterface.bulkDelete('sections', null, {});
    await queryInterface.bulkDelete('chapters', null, {});
    await queryInterface.bulkDelete('titles', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('codes', null, {});
  }
};
