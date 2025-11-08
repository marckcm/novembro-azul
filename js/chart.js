﻿﻿// Dados CSV embutidos
const csvData = `"Procedimento";"2025/Jan";"2025/Fev";"2025/Mar";"2025/Abr";"2025/Mai";"2025/Jun";"2025/Jul";"2025/Ago"
"0201010410 BIOPSIA DE PROSTATA";12;30;16;38;22;24;25;21
"0202030105 DOSAGEM DE ANTIGENO PROSTATICO ESPECIFICO (PSA)";3242;2715;678;4726;3046;2525;2956;3158
"0301010072 CONSULTA MEDICA EM ATENCAO ESPECIALIZADA";31023;37757;33989;41281;38992;40492;39624;39826`;

let chartData = [];
const colors = {
  "Consultas Especializadas": "#0066cc",
  "Exames de PSA": "#0080ff",
  "Biópsias de Próstata": "#27ae60",
};

function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines
    .shift()
    .split(";")
    .map((h) => h.trim().replace(/"/g, ""));
  const months = headers.slice(1);
  const monthlyData = months.map((month) => ({ Mês: month }));

  const procedureMap = {
    "0201010410 BIOPSIA DE PROSTATA": "Biópsias de Próstata",
    "0202030105 DOSAGEM DE ANTIGENO PROSTATICO ESPECIFICO (PSA)":
      "Exames de PSA",
    "0301010072 CONSULTA MEDICA EM ATENCAO ESPECIALIZADA":
      "Consultas Especializadas",
  };

  lines.forEach((line) => {
    const values = line.split(";");
    const procedureNameRaw = values.shift().trim().replace(/"/g, "");
    const cleanProcedureName = procedureMap[procedureNameRaw];

    if (cleanProcedureName) {
      values.forEach((value, index) => {
        if (monthlyData[index]) {
          monthlyData[index][cleanProcedureName] =
            parseInt(value.replace(/"/g, "").replace("-", "0")) || 0;
        }
      });
    }
  });

  return monthlyData;
}

function loadData() {
  try {
    chartData = parseCSV(csvData);
    return true;
  } catch (error) {
    console.error("Falha ao carregar dados CSV:", error);
    document.getElementById(
      "dados"
    ).innerHTML = `<div class="card" style="text-align:center; color: red;"><h2>Erro ao Carregar os Dados</h2><p>Não foi possível processar os dados do CSV.</p></div>`;
    return false;
  }
}

let mainChart;
let selectedSeries = [
  "Consultas Especializadas",
  "Exames de PSA",
  "Biópsias de Próstata",
];

function getChartConfig() {
  const labels = chartData.map((item) => item.Mês);

  const datasets = selectedSeries.map((series) => ({
    label: series,
    data: chartData.map((item) => item[series]),
    borderColor: colors[series],
    backgroundColor: colors[series] + "90",
    tension: 0.3,
    type: series === "Consultas Especializadas" ? "line" : "bar",
    yAxisID:
      series === "Consultas Especializadas" ? "yConsultas" : "yProcedimentos",
    borderWidth: series === "Consultas Especializadas" ? 3 : 1,
  }));

  return {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Procedimentos Mensais em Juiz de Fora/MG (2025)",
          font: { size: 18, weight: "bold" },
          color: "#003d7a",
        },
        legend: {
          display: true,
          position: "top",
          labels: { padding: 15, font: { size: 13 } },
        },
      },
      scales: {
        yConsultas: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          title: {
            display: true,
            text: "Nº de Consultas",
            font: { weight: "bold" },
          },
          ticks: { callback: (value) => value.toLocaleString("pt-BR") },
        },
        yProcedimentos: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          title: {
            display: true,
            text: "Nº de Exames / Biópsias",
            font: { weight: "bold" },
          },
          grid: { drawOnChartArea: false },
          ticks: { callback: (value) => value.toLocaleString("pt-BR") },
        },
        x: {
          title: {
            display: true,
            text: "Mês de Atendimento",
            font: { weight: "bold" },
          },
        },
      },
    },
  };
}

function createSeriesSelector() {
  const selectorContainer = document.getElementById("seriesSelector");
  selectorContainer.innerHTML = "";
  const availableSeries = Object.keys(chartData[0]).filter((k) => k !== "Mês");

  availableSeries.forEach((series) => {
    const isChecked = selectedSeries.includes(series);
    const checkboxId = `series-${series.replace(/\s+/g, "-")}`;
    const checkboxHTML = `
      <div class="series-checkbox" data-series="${series}">
          <input type="checkbox" id="${checkboxId}" ${
      isChecked ? "checked" : ""
    } aria-label="Alternar série ${series}">
          <label for="${checkboxId}">${series}</label>
      </div>`;
    selectorContainer.innerHTML += checkboxHTML;
  });
}

function toggleSeries(series) {
  const index = selectedSeries.indexOf(series);
  if (index > -1) selectedSeries.splice(index, 1);
  else selectedSeries.push(series);
  updateChart();
}

function updateChart() {
  if (!mainChart) return;
  mainChart.data.datasets = getChartConfig().data.datasets;
  mainChart.update();
}

function createTable() {
  const table = document.getElementById("dataTable");
  if (!table) return;
  const columns = Object.keys(chartData[0]);

  let headerHTML = `<thead><tr>${columns
    .map((c) => `<th>${c}</th>`)
    .join("")}</tr></thead>`;

  let bodyHTML =
    "<tbody>" +
    chartData
      .map(
        (item) =>
          `<tr>${columns
            .map((c) => `<td>${(item[c] || 0).toLocaleString("pt-BR")}</td>`)
            .join("")}</tr>`
      )
      .join("");

  const totals = {};
  columns.slice(1).forEach((col) => {
    totals[col] = chartData.reduce((sum, item) => sum + (item[col] || 0), 0);
  });
  bodyHTML += `<tr><td><strong>Total</strong></td>${columns
    .slice(1)
    .map(
      (c) => `<td><strong>${totals[c].toLocaleString("pt-BR")}</strong></td>`
    )
    .join("")}</tr></tbody>`;

  table.innerHTML = headerHTML + bodyHTML;
}

function initializeChartAndTable() {
  const chartCanvas = document.getElementById("mainChart");
  const skeleton = document.getElementById("chartSkeleton");
  const ctx = chartCanvas?.getContext("2d");

  if (!ctx || !skeleton) return;

  // Oculta o esqueleto e mostra o gráfico
  skeleton.style.display = "none";
  chartCanvas.style.display = "block";

  mainChart = new Chart(ctx, getChartConfig());
  createSeriesSelector();
  createTable();
}

export function initChartModule() {
  // Simula um atraso de carregamento (ex: chamada de API)
  setTimeout(() => {
    const dataLoaded = loadData();
    if (dataLoaded) {
      initializeChartAndTable();
    } else {
      // Se houver erro no loadData, esconde o skeleton e mostra a mensagem de erro
      const skeleton = document.getElementById("chartSkeleton");
      if (skeleton) {
        skeleton.style.display = "none";
      }
    }
  }, 1500); // Atraso de 1.5 segundos para visualização do skeleton

  // Event delegation for series checkboxes
  document.getElementById("seriesSelector")?.addEventListener("click", (e) => {
    const target = e.target.closest(".series-checkbox");
    if (target) {
      const series = target.dataset.series;
      if (series) {
        const checkbox = target.querySelector('input[type="checkbox"]');
        if (checkbox && e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        toggleSeries(series);
      }
    }
  });
}
