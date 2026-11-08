const money = (v) =>
  v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });

export function createView(root = document) {
  const refs = {
    summary: {
      income: root.getElementById('summary-income'),
      expense: root.getElementById('summary-expense'),
      balance: root.getElementById('summary-balance'),
    },
    list: root.getElementById('transactions'),
    listState: root.getElementById('list-state'),
    filterCategory: root.getElementById('filter-category'),
    txCategory: root.getElementById('tx-category'),
    formMessage: root.getElementById('form-message'),
    categoryMessage: root.getElementById('category-message'),
  };

  function renderSummary(summary) {
    refs.summary.income.textContent = money(summary.income);
    refs.summary.expense.textContent = money(summary.expense);
    refs.summary.balance.textContent = money(summary.balance);
    refs.summary.balance.classList.toggle('negative', summary.balance < 0);
  }

  function renderCategoryOptions(categories) {
    [refs.filterCategory, refs.txCategory].forEach((select) => {
      const current = select.value;
      select.innerHTML = '';
      if (select === refs.filterCategory) select.appendChild(new Option('Все', ''));
      categories.forEach((c) => {
        const label = `${c.name} (${c.type === 'income' ? 'доход' : 'расход'})`;
        select.appendChild(new Option(label, String(c.id)));
      });
      if (current) select.value = current;
      else if (select === refs.filterCategory) select.value = '';
    });
  }

  function renderTransactions(transactions, { loading = false } = {}) {
    refs.list.innerHTML = '';
    if (loading) {
      refs.listState.textContent = 'Загрузка…';
      return;
    }
    if (transactions.length === 0) {
      refs.listState.textContent = 'Операций нет.';
      return;
    }
    refs.listState.textContent = '';

    const fragment = document.createDocumentFragment();
    transactions.forEach((tx) => {
      const li = document.createElement('li');
      li.className = `tx tx--${tx.category_type}`;
      li.dataset.id = tx.id;

      const info = document.createElement('div');
      info.className = 'tx__info';
      info.innerHTML = `
        <strong>${money(tx.amount)}</strong>
        <span>${tx.category_name}</span>
        <span class="tx__date">${tx.date}</span>
        ${tx.comment ? `<span class="tx__comment">${tx.comment}</span>` : ''}
      `;

      const actions = document.createElement('div');
      actions.className = 'tx__actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.dataset.action = 'edit';
      editBtn.textContent = 'Изменить';

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.dataset.action = 'delete';
      delBtn.textContent = 'Удалить';

      actions.append(editBtn, delBtn);
      li.append(info, actions);
      fragment.appendChild(li);
    });
    refs.list.appendChild(fragment);
  }

  function showFormMessage(text, isError = false) {
    refs.formMessage.textContent = text;
    refs.formMessage.classList.toggle('message--error', isError);
  }

  function showCategoryMessage(text, isError = false) {
    refs.categoryMessage.textContent = text;
    refs.categoryMessage.classList.toggle('message--error', isError);
  }

  return { renderSummary, renderCategoryOptions, renderTransactions, showFormMessage, showCategoryMessage };
}