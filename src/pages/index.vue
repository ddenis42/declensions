<script setup>
  import FormatSelect from '@/components/FormatSelect.vue';
  import ResultTextarea from '@/components/ResultTextarea.vue';
  import * as shevchenko from 'shevchenko';
  import { militaryExtension } from 'shevchenko-ext-military';
  import { onBeforeMount, reactive, watch } from 'vue';

  shevchenko.registerExtension(militaryExtension);

  const parts = [
    'посада',
    'звання',
    'Прізвище',
    'Імʼя',
    'По батькові',
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
    inputFormat: parts,
    outputFormat: parts,
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
    && (settings.selectedCases.length > 0));

  watch(
    () => names.nominative + settings.inputFormat + settings.outputFormat,
    async () => {
      const payloads = names.nominative.toString()
        .split('\n')
        .filter(row => row && isFormatSet)
        .map(row => {
          const rawSplit = row.trim().split(/\s+/);
          if (rawSplit.length > settings.inputFormat.length) {
            const first = rawSplit.slice(0, rawSplit.length - settings.inputFormat.length + 1).join(' ');
            return [first, ...rawSplit.slice(rawSplit.length - settings.inputFormat.length + 1)];
          } else {
            return rawSplit;
          }
        })
        .map(parts => ({
          gender: 'masculine',
          militaryAppointment: parts[settings.inputFormat.indexOf('посада')],
          militaryRank: parts[settings.inputFormat.indexOf('звання')],
          familyName: parts[settings.inputFormat.indexOf('Прізвище')],
          givenName: parts[settings.inputFormat.indexOf('Імʼя')],
          patronymicName: parts[settings.inputFormat.indexOf('По батькові')],
        }));

      if (isFormatSet.value) {
        const declensions = await Promise.all(cases.map(async c => {
          const values = await Promise.all(payloads.map(
            async payload => await c.func(payload)
              .then(result => {
                const out = [];
                if (settings.outputFormat.indexOf('посада') >= 0) {
                  out[settings.outputFormat.indexOf('посада')] = result.militaryAppointment;
                }
                if (settings.outputFormat.indexOf('звання') >= 0) {
                  out[settings.outputFormat.indexOf('звання')] = result.militaryRank;
                }
                if (settings.outputFormat.indexOf('Прізвище') >= 0) {
                  out[settings.outputFormat.indexOf('Прізвище')] = result.familyName;
                }
                if (settings.outputFormat.indexOf('Імʼя') >= 0) {
                  out[settings.outputFormat.indexOf('Імʼя')] = result.givenName;
                }
                if (settings.outputFormat.indexOf('По батькові') >= 0) {
                  out[settings.outputFormat.indexOf('По батькові')] = result.patronymicName;
                }
                return out.join(' ');
              }
              )
          ));
          return { case: c.value, values };
        }));

        declensions.forEach(declension => {
          names[declension.case] = declension.values;
        });
      }
    }
  );

  onBeforeMount(() => {
    try {
      const storedSettings = localStorage.getItem('settings');

      if (storedSettings) {
        Object.assign(settings, JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error(error);
    }
  });

  watch(
    settings,
    async () => {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  )
</script>

<template>
  <div class="d-flex flex-wrap">
    <v-row>
      <v-col cols="12" md="4">
        <div id="settings">
          <!-- Your settings content here -->
          <FormatSelect v-model="settings.inputFormat" :items="parts" label="Вхідний формат" />
          <FormatSelect v-model="settings.outputFormat" :items="parts" label="Вихідний формат" />
          <FormatSelect
            v-model="settings.selectedCases"
            item-title="label"
            item-value="value"
            :items="cases"
            label="Відмінки"
          />
        </div>
      </v-col>
      <v-col cols="12" md="8">
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
