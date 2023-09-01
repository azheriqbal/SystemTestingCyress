
describe('Lookup Tables tests', () => {
  before(function () {
    cy.fixture('lookups').then(function (data) {
      this.data = data
    })
    cy.login();
    cy.contains('Configurations').click();
    cy.contains('Lookup Table').click();
  });

  it('Filling Lookup Tables',function  () {
   

    cy.contains('Add New').click();
    cy.get('#name').type(this.data.Sources.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.Sources.s1);


    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Ad Sources').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.AdSource.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.AdSource.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Reporting Schedule').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.ReportingSchedule.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.ReportingSchedule.s1);




    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Stage').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.Stage.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.Stage.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'ATS Names').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.AtsNames.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.AtsNames.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Candidate Status').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.CandidateStatus.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.CandidateStatus.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Job Status').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.JobStatus.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.JobStatus.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Contact Types').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.ContactTypes.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.ContactTypes.s1);




    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'User Designations').click();
    // cy.contains('Add New').click();
    // cy.get('#name').type("name");
    // cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains('Director');
    cy.contains('Client Service Leader');
    cy.contains('Recruiter');



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'Ownership').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.Ownership.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.Ownership.s1);



    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item-option-content', 'One Time Billing Types').click();
    cy.contains('Add New').click();
    cy.get('#name').type(this.data.OneTimeBillingTypes.s1);
    cy.get('.ant-modal-footer > .ant-btn-primary').click();
    cy.contains(this.data.OneTimeBillingTypes.s1);
  });
});