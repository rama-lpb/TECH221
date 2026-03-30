const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('[DEBUT] Debut du seed...');

  // Nettoyer les données existantes
  await prisma.affectation.deleteMany({});
  await prisma.employe.deleteMany({});
  await prisma.projet.deleteMany({});
  await prisma.departement.deleteMany({});

  console.log('Donnees existantes supprimees');

  // Créer les départements
  const deptIT = await prisma.departement.create({
    data: {
      code: 'IT',
      libelle: 'Informatique',
      archive: false,
    },
  });

  const deptHR = await prisma.departement.create({
    data: {
      code: 'RH',
      libelle: 'Ressources Humaines',
      archive: false,
    },
  });

  const deptFIN = await prisma.departement.create({
    data: {
      code: 'FIN',
      libelle: 'Finance',
      archive: false,
    },
  });

  const deptMKT = await prisma.departement.create({
    data: {
      code: 'MKT',
      libelle: 'Marketing',
      archive: false,
    },
  });

  console.log('4 Departements crees');

  // Créer les employés
  const emp1 = await prisma.employe.create({
    data: {
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@tech221.fr',
      telephone: '+33612345678',
      departementId: deptIT.id,
    },
  });

  const emp2 = await prisma.employe.create({
    data: {
      prenom: 'Marie',
      nom: 'Martin',
      email: 'marie.martin@tech221.fr',
      telephone: '+33698765432',
      departementId: deptIT.id,
    },
  });

  const emp3 = await prisma.employe.create({
    data: {
      prenom: 'Pierre',
      nom: 'Bernard',
      email: 'pierre.bernard@tech221.fr',
      telephone: '+33612349876',
      departementId: deptHR.id,
    },
  });

  const emp4 = await prisma.employe.create({
    data: {
      prenom: 'Sophie',
      nom: 'Durand',
      email: 'sophie.durand@tech221.fr',
      telephone: '+33743210987',
      departementId: deptFIN.id,
    },
  });

  const emp5 = await prisma.employe.create({
    data: {
      prenom: 'Luc',
      nom: 'Leclerc',
      email: 'luc.leclerc@tech221.fr',
      telephone: '+33765432109',
      departementId: deptMKT.id,
    },
  });

  const emp6 = await prisma.employe.create({
    data: {
      prenom: 'Anne',
      nom: 'Moreau',
      email: 'anne.moreau@tech221.fr',
      telephone: '+33654321987',
      departementId: deptIT.id,
    },
  });

  console.log('6 Employes crees');

  // Créer les projets
  const proj1 = await prisma.projet.create({
    data: {
      nom: 'Migration Base de Données',
      description: 'Migration de PostgreSQL vers MongoDB',
      dateDebut: new Date('2026-01-15'),
      dateFin: new Date('2026-04-30'),
      statut: 'EN_COURS',
    },
  });

  const proj2 = await prisma.projet.create({
    data: {
      nom: 'Développement API REST',
      description: 'Création d\'une API RESTful pour gestion interne',
      dateDebut: new Date('2026-02-01'),
      dateFin: new Date('2026-06-30'),
      statut: 'EN_COURS',
    },
  });

  const proj3 = await prisma.projet.create({
    data: {
      nom: 'Refonte Interface Web',
      description: 'Modernisation du dashboard admin',
      dateDebut: new Date('2026-03-01'),
      dateFin: null,
      statut: 'BROUILLON',
    },
  });

  const proj4 = await prisma.projet.create({
    data: {
      nom: 'Audit de Sécurité',
      description: 'Audit complet des systèmes de sécurité',
      dateDebut: new Date('2025-11-01'),
      dateFin: new Date('2026-01-31'),
      statut: 'TERMINE',
    },
  });

  const proj5 = await prisma.projet.create({
    data: {
      nom: 'Projet Annulé',
      description: 'Ce projet a été annulé',
      dateDebut: new Date('2026-05-01'),
      dateFin: null,
      statut: 'ANNULE',
    },
  });

  console.log('5 Projets crees');

  // Créer les affectations
  await prisma.affectation.create({
    data: {
      employeId: emp1.id,
      projetId: proj1.id,
      role: 'Lead Developer',
      dateAffectation: new Date('2026-01-15'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp2.id,
      projetId: proj1.id,
      role: 'Developer',
      dateAffectation: new Date('2026-01-20'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp1.id,
      projetId: proj2.id,
      role: 'Architect',
      dateAffectation: new Date('2026-02-01'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp6.id,
      projetId: proj2.id,
      role: 'Developer',
      dateAffectation: new Date('2026-02-10'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp2.id,
      projetId: proj2.id,
      role: 'QA Engineer',
      dateAffectation: new Date('2026-02-15'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp3.id,
      projetId: proj4.id,
      role: 'Project Manager',
      dateAffectation: new Date('2025-11-01'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp1.id,
      projetId: proj4.id,
      role: 'Tech Lead',
      dateAffectation: new Date('2025-11-01'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp4.id,
      projetId: proj3.id,
      role: 'Business Analyst',
      dateAffectation: new Date('2026-03-01'),
    },
  });

  await prisma.affectation.create({
    data: {
      employeId: emp5.id,
      projetId: proj3.id,
      role: 'Marketing Lead',
      dateAffectation: new Date('2026-03-05'),
    },
  });

  console.log('9 Affectations creees');

  console.log('[OK] Seed complete avec succes!');
  console.log('\nRecapitulatif:');
  console.log(`   - 4 Départements`);
  console.log(`   - 6 Employés`);
  console.log(`   - 5 Projets`);
  console.log(`   - 9 Affectations`);
}

main()
  .catch((e) => {
    console.error('[ERREUR] Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
