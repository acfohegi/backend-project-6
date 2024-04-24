export default [
  [
    'simple',
    {
      filters: {
        status: [
          1,
        ],
        label: [],
        executor: [
          1,
        ],
        creator: [
          1,
        ],
      },
      result: [
        1,
      ],
    },
  ],
  [
    'multiOptions',
    {
      filters: {
        status: [],
        label: [
          1,
          2,
        ],
        executor: [],
        creator: [],
      },
      result: [
        1,
        2,
      ],
    },
  ],
  [
    'allParams',
    {
      filters: {
        status: [
          3,
        ],
        label: [
          1,
          2,
        ],
        executor: [
          1,
          2,
        ],
        creator: [
          1,
          2,
        ],
      },
      result: [],
    },
  ],
  [
    'noFilters',
    {
      filters: {},
      result: [
        1,
        2,
        3,
      ],
    },
  ],
];
