function toggleSections(sectionToShow, buttonToHighlight) {
  const sections = [
    "addMoneySection",
    "cashOutSection",
    "transferMoneySection",
    "getBonusSection",
    "payBillSection",
    "transactionHistorySection",
    "latestPaymentSection",
  ];

  sections.forEach((section) => {
    _id(section).classList.toggle("hidden", section !== sectionToShow);
  });

  const buttons = [
    "addMoneySectionBtn",
    "cashOutSectionBtn",
    "transferMoneySectionBtn",
    "getBonusSectionBtn",
    "payBillSectionBtn",
    "transactionHistorySectionBtn",
    "latestPaymentSectionBtn",
  ];

  buttons.forEach((button) => {
    const isActive = button === buttonToHighlight;
    _id(button).classList.toggle("border-sky-500", isActive);
    _id(button).classList.toggle("bg-sky-100", isActive);

    const textId = button + "Text";
    if (_id(textId)) {
      _id(textId).classList.toggle("text-sky-500", isActive);
      _id(textId).classList.toggle("font-bold", isActive);
    }
  });
}

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

export default allBtnSections;
