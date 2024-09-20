function _id(id) {
  return document.getElementById(id);
}
let balance = 0;
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

function handleFormSubmission({
  buttonId,
  inputFields,
  errors,
  endpoint,
  successMessage,
  failureMessage,
}) {
  _id(buttonId).addEventListener("click", async function (e) {
    e.preventDefault();

    // Clear previous errors
    Object.keys(errors).forEach((key) => {
      _id(errors[key]).innerText = "";
    });

    // Gather input values
    const sendData = {};
    let isValid = true;

    inputFields.forEach(({ field, errorMessage }) => {
      const value = _id(field).value;
      if (!value) {
        _id(errors[field]).innerText = errorMessage;
        isValid = false;
      } else {
        sendData[field] = value;
      }
    });

    if (!isValid) {
      return;
    }

    // Send POST request
    const response = await fetch(`http://localhost:3030/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(sendData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    balance = data.balance;
    // Handle response
    alert(data.status === "success" ? successMessage : failureMessage);

    // Clear input fields
    inputFields.forEach(({ field }) => {
      _id(field).value = "";
    });
  });
}

function initializeForms() {
  const formConfigs = [
    {
      buttonId: "addMoneyButton",
      inputFields: [
        { field: "addMoneyBank", errorMessage: "Bank is required" },
        {
          field: "addMoneyAccountNumber",
          errorMessage: "Account Number is required",
        },
        { field: "addMoneyAmount", errorMessage: "Amount is required" },
        { field: "addMoneyPinNumber", errorMessage: "Pin Number is required" },
      ],
      errors: {
        addMoneyBank: "addMoneyBankError",
        addMoneyAccountNumber: "addMoneyAccountNumberError",
        addMoneyAmount: "addMoneyAmountError",
        addMoneyPinNumber: "addMoneyPinNumberError",
      },
      endpoint: "add-money",
      successMessage: "Successfully Added",
      failureMessage: "Failed to Add",
    },
    {
      buttonId: "cashOutButton",
      inputFields: [
        {
          field: "cashOutAgentNumber",
          errorMessage: "Agent Number is required",
        },
        {
          field: "cashOutWithdrawAmount",
          errorMessage: "Withdraw Amount is required",
        },
        { field: "cashOutPinNumber", errorMessage: "Pin Number is required" },
      ],
      errors: {
        cashOutAgentNumber: "cashOutAgentNumberError",
        cashOutWithdrawAmount: "cashOutWithdrawAmountError",
        cashOutPinNumber: "cashOutPinNumberError",
      },
      endpoint: "cash-out",
      successMessage: "Successfully Cashed Out",
      failureMessage: "Failed to Cash Out",
    },
    {
      buttonId: "transferMoneyBtn",
      inputFields: [
        {
          field: "userAccountNumber",
          errorMessage: "User Account Number is required",
        },
        { field: "transferAmount", errorMessage: "Amount is required" },
        { field: "transferPinNumber", errorMessage: "Pin Number is required" },
      ],
      errors: {
        userAccountNumber: "userAccountNumberError",
        transferAmount: "transferAmountError",
        transferPinNumber: "transferPinNumberError",
      },
      endpoint: "transfer-money",
      successMessage: "Successfully Transferred",
      failureMessage: "Failed to Transfer Money",
    },
    {
      buttonId: "getBonusButton",
      inputFields: [
        { field: "getBonusCoupon", errorMessage: "Coupon is required" },
      ],
      errors: {
        getBonusCoupon: "getBonusCouponError",
      },
      endpoint: "get-bonus",
      successMessage: "Successfully Got Bonus",
      failureMessage: "Failed to Get Bonus",
    },
    {
      buttonId: "payBillBut",
      inputFields: [
        {
          field: "payBillSelectToPay",
          errorMessage: "Select To Pay is required",
        },
        {
          field: "payBillBankAccountNumber",
          errorMessage: "Bank Account Number is required",
        },
        {
          field: "payBillAmountToAdd",
          errorMessage: "Amount to Add is required",
        },
        { field: "payBillPinNumber", errorMessage: "Pin Number is required" },
      ],
      errors: {
        payBillSelectToPay: "payBillSelectToPayError",
        payBillBankAccountNumber: "payBillBankAccountNumberError",
        payBillAmountToAdd: "payBillAmountToAddError",
        payBillPinNumber: "payBillPinNumberError",
      },
      endpoint: "pay-bill",
      successMessage: "Successfully Paid Bill",
      failureMessage: "Failed to Pay Bill",
    },
  ];

  formConfigs.forEach((config) => handleFormSubmission(config));
}

// initializeForms();

function addMoneyButtonClick() {
  _id("addMoneyButton").addEventListener("click", async function (e) {
    e.preventDefault();
    let carnetBalance = parseFloat(_id("userBalance").innerText);
    let addMoneyAmount = parseFloat(_id("addMoneyAmount").value);
    carnetBalance = carnetBalance + addMoneyAmount;

    _id("userBalance").innerText = carnetBalance;
  });
}
addMoneyButtonClick();

// document.addEventListener("DOMContentLoaded", () => {
allBtnSections();
initializeForms();
// });