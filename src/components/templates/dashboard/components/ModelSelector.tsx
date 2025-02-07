import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ModelOptions } from "@/app/types/modelTypes";
import { useModelProvider } from "../../../../app/context/ModelProviderContext";

interface ModelSelectorProps {
  disabled?: boolean;
}

export default function ModelSelector({ disabled }: ModelSelectorProps) {
  const { model, setModel } = useModelProvider();
  return (
    <FormControl size="small" sx={{ minWidth: 200 }} disabled={disabled}>
      <InputLabel>Model</InputLabel>
      <Select
        value={model}
        label="Model"
        onChange={(e) => {
          setModel(e.target.value as ModelOptions);
        }}
      >
        {Object.values(ModelOptions).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
