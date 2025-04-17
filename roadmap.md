# Traceform: Current State & Roadmap

This document visualizes the current state of the core Traceform tools following the MVP completion and outlines the planned future work under TASK_017.

```mermaid
graph TD
    subgraph "Current State (MVP Complete)"
        A["Babel Plugin\nID: BABEL_PLUGIN\nv0.2.10"]
        B["VS Code Extension\nID: VSC_EXT\nv0.1.20"]
        C["Browser Extension\nID: EXT_*\nv0.1.3"]
    end

    subgraph "Roadmap (TASK_017: Polish, Productionize, Consolidate)"
        T017[TASK_017]
        T017_1["1. Onboarding Wizard"]
        T017_2["2. Error Handling & Diagnostics"]
        T017_3["3. Versioning & Upgrade Checks"]
        T017_4["4. Documentation & Quickstart"]
        T017_5["5. Shared Logic Package"]
        T017_6["6. Status Dashboards"]
        T017_7["7. Tool Presence Detection"]
        T017_8["8. Partial Consolidation R&D"]
        T017_9["9. Analytics & Privacy"]
        T017_10["10. Unified Installer"]
        T017_11["11. Enterprise Onboarding"]
    end

    A --> T017
    B --> T017
    C --> T017

    T017 --> T017_1
    T017 --> T017_2
    T017 --> T017_3
    T017 --> T017_4
    T017 --> T017_5
    T017 --> T017_6
    T017 --> T017_7
    T017 --> T017_8
    T017 --> T017_9
    T017 --> T017_10
    T017 --> T017_11

    style A fill:#ccffcc,stroke:#333,stroke-width:2px
    style B fill:#ccffcc,stroke:#333,stroke-width:2px
    style C fill:#ccffcc,stroke:#333,stroke-width:2px
    style T017 fill:#ccccff,stroke:#333,stroke-width:2px
```

*   **Current State:** Shows the three core components that form the Traceform MVP, along with their latest published versions.
*   **Roadmap:** Outlines the subtasks defined within TASK_017, which focuses on polishing, productionizing, and potentially consolidating the toolset for a better developer experience.

*(This visualization is based on information from `memory_docs/codeMap_root.md` and `memory_docs/activeContext.md` as of 2025-04-16)*
