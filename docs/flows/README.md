# Flow Diagrams

Draw.io diagrams for major components and scripts. Open `.drawio` files in draw.io desktop.

## Files

| Diagram | Component | Bugs found |
|---------|-----------|------------|
| *(none yet)* | — | — |

## Convention

- One `.drawio` file per script or major feature
- Mark `⚠️` nodes for known risks / missing guards
- Update diagram when code logic changes (same PR)
- Generate with: `/flow create <name>`

## Color Legend

| Color | Meaning |
|-------|---------|
| Yellow | Normal step |
| Blue ellipse | Start / End |
| Green | Success / external happy path |
| Red | ⚠️ Bug / missing guard — fix required |
| Orange | ⚠️ Risk / monitor needed |
| Purple | External component / deferred |
| Rhombus | Decision point |
| Dashed edge | Error path / non-obvious flow |

## AEGIS Flow Skill

This project uses AEGIS `/flow` skill for diagram generation:
```
/flow create <name>   # Generate diagram from code
/flow list            # List all diagrams + ⚠️ counts
/flow check <name>    # Check diagram vs current code
/flow update <name>   # Regenerate from current code
```
