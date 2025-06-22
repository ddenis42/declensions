<script setup>
  import * as shevchenko from 'shevchenko';
  import FormatSelect from '@/components/FormatSelect.vue';
  import ResultTextarea from '@/components/ResultTextarea.vue';
  import { debounce } from '@/utils/debounce.js';
  import { militaryExtension } from 'shevchenko-ext-military';
  import { onBeforeMount, reactive, watch } from 'vue';

  shevchenko.registerExtension(militaryExtension);

  const formatParts = [
    { label: 'посада', value: 'militaryAppointment' },
    { label: 'звання', value: 'militaryRank' },
    { label: 'Прізвище', value: 'familyName' },
    { label: 'Ім`я', value: 'givenName' },
    { label: 'По батькові', value: 'patronymicName' },
  ]

  const cases = [
    { label: 'Родовий (кого?)', value: 'genitive', func: shevchenko.inGenitive },
    { label: 'Давальний (кому?)', value: 'dative', func: shevchenko.inDative },
    { label: 'Знахідний (кого?)', value: 'accusative', func: shevchenko.inAccusative },
    { label: 'Орудний (ким?)', value: 'ablative', func: shevchenko.inAblative },
    { label: 'Місцевий (при кому?)', value: 'locative', func: shevchenko.inLocative },
    { label: 'Кличний', value: 'vocative', func: shevchenko.inVocative },
  ];

  const settings = reactive({
    inputFormat: formatParts.map(o => o.value),
    outputFormat: formatParts.map(o => o.value),
    selectedCases: cases.map(c => c.value),
  });

  const names = reactive({
    nominative: '',
    genitive: [],
    dative: [],
    accusative: [],
    ablative: [],
    locative: [],
    vocative: [],
  });

  const isFormatSet = computed(() =>
    (settings.inputFormat.length > 0)
    && (settings.outputFormat.length > 0)
    && (settings.selectedCases.length > 0)
  );

  const decline = async () => {
    if (!isFormatSet.value) return;

    const payloads = await Promise.all(
      names.nominative.toString()
        .split('\n')
        .map(row => row.trim())
        .filter(row => row)
        .map(row => {
          const rawSplit = row.split(/\s+/);

          let result = rawSplit;

          if (rawSplit.length > settings.inputFormat.length) {
            const first = rawSplit.slice(0, rawSplit.length - settings.inputFormat.length + 1).join(' ');
            result = [first, ...rawSplit.slice(rawSplit.length - settings.inputFormat.length + 1)];
          }

          return result;
        })
        .map(async function (rowParts) {
          const genderValue = await shevchenko.detectGender({
            familyName: rowParts[settings.inputFormat.indexOf('familyName')],
            givenName: rowParts[settings.inputFormat.indexOf('givenName')],
            patronymicName: rowParts[settings.inputFormat.indexOf('patronymicName')],
          }).catch(() => null) ?? 'masculine';

          const payload = { gender: genderValue };

          formatParts.forEach(o => payload[o.value] = rowParts[settings.inputFormat.indexOf(o.value)]);

          return payload;
        })
    );

    cases.forEach(async c => {
      names[c.value] = await Promise.all(payloads.map(
        async payload => await c.func(payload)
          .then(result => settings.outputFormat.map(option => result[option]).filter(e => e).join(' '))
      ));
    });
  };

  const debouncedDecline = debounce(() => decline(), 300);

  watch(
    () => names.nominative + settings.inputFormat + settings.outputFormat,
    () => debouncedDecline(),
  );

  onBeforeMount(() => {
    const storedValue = localStorage.getItem('settings');
    if (!storedValue) return;

    const storedSettings = JSON.parse(storedValue);

    const allowedFormat = formatParts.map(fp => fp.value);
    settings.inputFormat = storedSettings.inputFormat.filter(s => allowedFormat.includes(s));
    settings.outputFormat = storedSettings.outputFormat.filter(s => allowedFormat.includes(s));

    const allowedCases = cases.map(c => c.value);
    settings.selectedCases = storedSettings.selectedCases.filter(s => allowedCases.includes(s));
  });

  watch(settings, async () => {
    localStorage.setItem('settings', JSON.stringify(settings));
  });
</script>

<template>
  <div class="d-flex flex-wrap">
    <v-row>
      <v-col id="settings" cols="12" md="4">
        <FormatSelect
          v-model="settings.inputFormat"
          item-title="label"
          item-value="value"
          :items="formatParts"
          label="Вхідний формат"
        />

        <FormatSelect
          v-model="settings.outputFormat"
          item-title="label"
          item-value="value"
          :items="formatParts"
          label="Вихідний формат"
        />

        <FormatSelect
          v-model="settings.selectedCases"
          item-title="label"
          item-value="value"
          :items="cases"
          label="Відмінки"
        />
      </v-col>

      <v-col id="nominativeInput" cols="12" md="8">
        <v-textarea
          id="input"
          v-model="names.nominative"
          auto-grow
          class="fill-height"
          clearable
          label="Називний (хто?)"
        />
      </v-col>
    </v-row>
  </div>

  <div id="output" class="d-flex flex-wrap justify-space-between">
    <v-row>
      <v-col
        v-for="(selectedCase) in settings.selectedCases"
        :key="selectedCase"
        cols="12"
        lg="6"
      >
        <ResultTextarea v-model="names[selectedCase]" :label="cases.find(c => c.value === selectedCase).label" />
      </v-col>
    </v-row>
  </div>
</template>
