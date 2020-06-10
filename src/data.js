export const data= [
        {
          id: "a001",
          name: "IT Manager",
          type: "typeA",
          starts_with: "Tree",
        },
        {
          id: "b002",
          name: "Regional Manager",
          expanded: true,
          type: "typeB",
          starts_with: "simple",
          children: [
            {
              id: "c003",
              name: "Branch Manager",
              type: "typeC",
              starts_with: "Complex",
            },
          ],
        },
      ]