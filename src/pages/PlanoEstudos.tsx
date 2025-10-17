import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/ProgressBar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from "react-dropzone";

const diasSemana = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

const PlanoEstudos = () => {
  const navigate = useNavigate();
  const [materia, setMateria] = useState("");
  const [horasPorDia, setHorasPorDia] = useState([3]);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [duracaoSemanas, setDuracaoSemanas] = useState([4]);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setArquivo(acceptedFiles[0]);
      }
    },
  });

  const progressSteps = [
    { progress: 20, message: "Analisando matéria..." },
    { progress: 40, message: "Processando documento..." },
    { progress: 60, message: "Criando cronograma..." },
    { progress: 80, message: "Organizando tópicos..." },
    { progress: 95, message: "Finalizando plano..." },
    { progress: 100, message: "✅ Plano pronto!" },
  ];

  const simulateProgress = () => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep].progress);
        setStatusMessage(progressSteps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return interval;
  };

  const toggleDia = (diaId: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(diaId)
        ? prev.filter((d) => d !== diaId)
        : [...prev, diaId]
    );
  };

  const handleGenerate = async () => {
    if (!materia.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe a matéria que deseja estudar.",
        variant: "destructive",
      });
      return;
    }

    if (diasSelecionados.length === 0) {
      toast({
        title: "Selecione os dias",
        description: "Escolha pelo menos um dia da semana.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const progressInterval = simulateProgress();

    try {
      let arquivoBase64: string | undefined;
      let tipoArquivo: "pdf" | "imagem" | undefined;

      if (arquivo) {
        const reader = new FileReader();
        arquivoBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(arquivo);
        });
        tipoArquivo = arquivo.type.includes("pdf") ? "pdf" : "imagem";
      }

      const { data, error } = await supabase.functions.invoke("gerar-plano-estudos", {
        body: {
          materia,
          horasPorDia: horasPorDia[0],
          diasSemana: diasSelecionados,
          duracaoSemanas: duracaoSemanas[0],
          arquivo: arquivoBase64,
          tipoArquivo,
        },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      if (data?.plano) {
        setProgress(100);
        setStatusMessage("✅ Plano pronto!");

        setTimeout(() => {
          navigate("/plano-estudos/resultado", {
            state: {
              plano: data.plano,
              materia,
              totalHoras: data.totalHoras,
            },
          });
        }, 500);
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Erro ao gerar plano:", error);
      toast({
        title: "Erro ao gerar plano",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <ProgressBar
            progress={progress}
            message={statusMessage}
            subMessage="Criando seu cronograma personalizado..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Plano de Estudos</h1>
        <p className="text-sm text-muted-foreground">
          Crie um cronograma personalizado para suas matérias
        </p>
      </div>

      <div className="space-y-6">
        {/* Matéria */}
        <div className="space-y-2">
          <Label htmlFor="materia">Matéria ou Tema *</Label>
          <Input
            id="materia"
            placeholder="Ex: Direito Constitucional, Processo Penal..."
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          />
        </div>

        {/* Upload opcional */}
        <div className="space-y-2">
          <Label>Ementa ou Material (Opcional)</Label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            {arquivo ? (
              <p className="text-sm text-foreground font-medium">{arquivo.name}</p>
            ) : (
              <>
                <p className="text-sm text-foreground mb-1">
                  Arraste um PDF ou imagem (opcional)
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG ou WEBP até 20MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Horas por dia */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Horas disponíveis por dia</Label>
            <span className="text-sm font-semibold text-accent">{horasPorDia[0]}h</span>
          </div>
          <Slider
            value={horasPorDia}
            onValueChange={setHorasPorDia}
            min={1}
            max={8}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Dias da semana */}
        <div className="space-y-3">
          <Label>Dias da semana *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {diasSemana.map((dia) => (
              <Card
                key={dia.id}
                className={`cursor-pointer transition-all ${
                  diasSelecionados.includes(dia.id)
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
                onClick={() => toggleDia(dia.id)}
              >
                <CardContent className="p-3 flex items-center gap-2">
                  <Checkbox
                    checked={diasSelecionados.includes(dia.id)}
                    onCheckedChange={() => toggleDia(dia.id)}
                  />
                  <span className="text-sm font-medium">{dia.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Duração do plano</Label>
            <span className="text-sm font-semibold text-accent">
              {duracaoSemanas[0]} {duracaoSemanas[0] === 1 ? "semana" : "semanas"}
            </span>
          </div>
          <Slider
            value={duracaoSemanas}
            onValueChange={setDuracaoSemanas}
            min={1}
            max={12}
            step={1}
            className="w-full"
          />
        </div>

        {/* Total de horas */}
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Carga horária total</span>
              </div>
              <span className="text-lg font-bold text-accent">
                {(horasPorDia[0] * diasSelecionados.length * duracaoSemanas[0]).toFixed(1)}h
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Botão de gerar */}
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full"
          disabled={isProcessing}
        >
          Gerar Plano de Estudos
        </Button>
      </div>
    </div>
  );
};

export default PlanoEstudos;
