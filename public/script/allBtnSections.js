function allBtnSections() {
  const buttonConfig = [
    { btnId: "addMoneySectionBtn", sectionId: "addMoneySection" },
    { btnId: "cashOutSectionBtn", sectionId: "cashOutSection" },
    { btnId: "transferMoneySectionBtn", sectionId: "transferMoneySection" },
    { btnId: "getBonusSectionBtn", sectionId: "getBonusSection" },
    { btnId: "payBillSectionBtn", sectionId: "payBillSection" },
    {
      btnId: "transactionHistorySectionBtn",
      sectionId: "transactionHistorySection",
    },
    { btnId: "latestPaymentSectionBtn", sectionId: "latestPaymentSection" },
  ];

  buttonConfig.forEach(({ btnId, sectionId }) => {
    const button = _id(btnId);
    if (button) {
      button.addEventListener("click", () => toggleSections(sectionId, btnId));
    } else {
      console.warn(`Button with ID "${btnId}" not found.`);
    }
  });
}
