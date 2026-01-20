import React, { useMemo, useState } from 'react';
import {
  AppConfig,
  defaultAppConfig,
  redactAppConfigForExport,
  resetAppConfig,
  saveAppConfig,
} from './appConfig';

type Props = {
  config: AppConfig;
  onConfigChange: (next: AppConfig) => void;
  onExit: () => void;
};

const FieldLabel: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="flex flex-col gap-1">
    <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">{title}</div>
    {hint ? <div className="text-xs text-white/20 leading-relaxed">{hint}</div> : null}
  </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={
      'w-full bg-[#050508] border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-purple-500/40 transition-all placeholder-white/10 shadow-inner ' +
      (props.className || '')
    }
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={
      'w-full bg-[#050508] border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-purple-500/40 transition-all placeholder-white/10 shadow-inner min-h-[120px] ' +
      (props.className || '')
    }
  />
);

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
      checked
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        : 'bg-white/5 border-white/10 text-white/30 hover:border-purple-500/30'
    }`}
  >
    {checked ? 'Enabled' : 'Disabled'}
  </button>
);

const AdminDashboard: React.FC<Props> = ({ config, onConfigChange, onExit }) => {
  const [importJson, setImportJson] = useState('');
  const [includeSecrets, setIncludeSecrets] = useState(false);

  const exportJson = useMemo(() => {
    const payload = includeSecrets ? config : redactAppConfigForExport(config);
    return JSON.stringify(payload, null, 2);
  }, [config, includeSecrets]);

  const setCfg = (updater: (prev: AppConfig) => AppConfig) => onConfigChange(updater(config));

  const save = () => saveAppConfig(config);

  const reset = () => {
    resetAppConfig();
    onConfigChange(defaultAppConfig);
    saveAppConfig(defaultAppConfig);
  };

  const doImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      onConfigChange(parsed);
      saveAppConfig(parsed);
      setImportJson('');
    } catch {
      // keep minimal: invalid JSON
      alert('Invalid JSON');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = exportJson;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-purple-100 px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[10px] font-black tracking-[0.8em] uppercase text-white/20 mb-3">Admin</div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Dashboard <span className="text-purple-400 italic font-serif">Settings</span>
            </h1>
            <p className="text-white/30 mt-4 max-w-2xl">
              Edytuj ustawienia bota AI i treści sekcji na frontpage. Zapis jest w <span className="text-white">localStorage</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-purple-500/30 hover:text-white transition-all"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-purple-500/30 hover:text-white transition-all"
            >
              Back to site
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-black tracking-[0.5em] uppercase text-white/30 mb-2">AI Bot</div>
                <div className="text-2xl font-black text-white">Gemini settings</div>
              </div>
            </div>

            <div className="space-y-3">
              <FieldLabel
                title="Gemini API key"
                hint="Jeśli pusty, aplikacja spróbuje użyć klucza wbudowanego podczas builda (process.env.API_KEY)."
              />
              <TextInput
                value={config.ai.geminiApiKey || ''}
                placeholder="Paste key (starts with AI...)"
                onChange={(e) => setCfg((p) => ({ ...p, ai: { ...p.ai, geminiApiKey: e.target.value } }))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FieldLabel title="Chat model" />
                <TextInput
                  value={config.ai.chat.model}
                  onChange={(e) =>
                    setCfg((p) => ({ ...p, ai: { ...p.ai, chat: { ...p.ai.chat, model: e.target.value } } }))
                  }
                />
              </div>
              <div className="space-y-3">
                <FieldLabel title="Chat temperature" hint="0.0–2.0" />
                <TextInput
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={String(config.ai.chat.temperature)}
                  onChange={(e) =>
                    setCfg((p) => ({
                      ...p,
                      ai: { ...p.ai, chat: { ...p.ai.chat, temperature: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <FieldLabel title="Chat system instruction" />
              <TextArea
                value={config.ai.chat.systemInstruction}
                onChange={(e) =>
                  setCfg((p) => ({
                    ...p,
                    ai: { ...p.ai, chat: { ...p.ai.chat, systemInstruction: e.target.value } },
                  }))
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FieldLabel title="Dream model" />
                <TextInput
                  value={config.ai.dream.model}
                  onChange={(e) =>
                    setCfg((p) => ({ ...p, ai: { ...p.ai, dream: { ...p.ai.dream, model: e.target.value } } }))
                  }
                />
              </div>
              <div className="space-y-3">
                <FieldLabel title="Dream temperature" hint="0.0–2.0" />
                <TextInput
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={String(config.ai.dream.temperature)}
                  onChange={(e) =>
                    setCfg((p) => ({
                      ...p,
                      ai: { ...p.ai, dream: { ...p.ai.dream, temperature: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <FieldLabel title="Dream system instruction" />
              <TextArea
                value={config.ai.dream.systemInstruction}
                onChange={(e) =>
                  setCfg((p) => ({
                    ...p,
                    ai: { ...p.ai, dream: { ...p.ai.dream, systemInstruction: e.target.value } },
                  }))
                }
              />
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div>
              <div className="text-[10px] font-black tracking-[0.5em] uppercase text-white/30 mb-2">Frontpage</div>
              <div className="text-2xl font-black text-white">Editable sections</div>
            </div>

            {(
              [
                ['intro', 'Intro'],
                ['purpose', 'Purpose'],
                ['about', 'Manifesto'],
                ['archive', 'Archive'],
                ['vision', 'Vision'],
                ['mission', 'Mission'],
              ] as const
            ).map(([id, label]) => (
              <div key={id} className="space-y-6 border-t border-white/5 pt-8">
                <div className="flex items-center justify-between gap-6">
                  <div className="text-lg font-black text-white">{label}</div>
                  <Toggle
                    checked={config.frontpage[id].enabled}
                    onChange={(v) => setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, [id]: { ...p.frontpage[id], enabled: v } } }))}
                  />
                </div>

                {id === 'intro' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Badge text" />
                      <TextInput
                        value={config.frontpage.intro.badgeText}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: { ...p.frontpage, intro: { ...p.frontpage.intro, badgeText: e.target.value } },
                          }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.intro.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                intro: { ...p.frontpage.intro, headingLine1: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.intro.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                intro: { ...p.frontpage.intro, headingEmphasis: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 2" />
                        <TextInput
                          value={config.frontpage.intro.headingLine2}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                intro: { ...p.frontpage.intro, headingLine2: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading accent" />
                        <TextInput
                          value={config.frontpage.intro.headingAccent}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                intro: { ...p.frontpage.intro, headingAccent: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.intro.description}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: {
                              ...p.frontpage,
                              intro: { ...p.frontpage.intro, description: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Scroll hint" />
                      <TextInput
                        value={config.frontpage.intro.scrollHint}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: {
                              ...p.frontpage,
                              intro: { ...p.frontpage.intro, scrollHint: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="CTA cards (3)" hint="Możesz ustawić scrollTo (id sekcji) albo href (link)." />
                      <div className="space-y-6">
                        {config.frontpage.intro.ctas.slice(0, 3).map((cta, idx) => (
                          <div key={idx} className="grid md:grid-cols-3 gap-4">
                            <TextInput
                              value={cta.title}
                              placeholder="Title"
                              onChange={(e) =>
                                setCfg((p) => {
                                  const next = [...p.frontpage.intro.ctas];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  return { ...p, frontpage: { ...p.frontpage, intro: { ...p.frontpage.intro, ctas: next } } };
                                })
                              }
                            />
                            <TextInput
                              value={cta.label}
                              placeholder="Label"
                              onChange={(e) =>
                                setCfg((p) => {
                                  const next = [...p.frontpage.intro.ctas];
                                  next[idx] = { ...next[idx], label: e.target.value };
                                  return { ...p, frontpage: { ...p.frontpage, intro: { ...p.frontpage.intro, ctas: next } } };
                                })
                              }
                            />
                            <TextInput
                              value={cta.href || cta.scrollTo || ''}
                              placeholder="href OR scrollTo"
                              onChange={(e) =>
                                setCfg((p) => {
                                  const v = e.target.value.trim();
                                  const next = [...p.frontpage.intro.ctas];
                                  next[idx] = {
                                    ...next[idx],
                                    href: v.startsWith('http') || v.startsWith('mailto:') ? v : undefined,
                                    scrollTo: v && !(v.startsWith('http') || v.startsWith('mailto:')) ? v : undefined,
                                  };
                                  return { ...p, frontpage: { ...p.frontpage, intro: { ...p.frontpage.intro, ctas: next } } };
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : id === 'purpose' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Pill text" />
                      <TextInput
                        value={config.frontpage.purpose.pillText}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: { ...p.frontpage, purpose: { ...p.frontpage.purpose, pillText: e.target.value } },
                          }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.purpose.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                purpose: { ...p.frontpage.purpose, headingLine1: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.purpose.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                purpose: { ...p.frontpage.purpose, headingEmphasis: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Quote" />
                      <TextArea
                        value={config.frontpage.purpose.quote}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: { ...p.frontpage, purpose: { ...p.frontpage.purpose, quote: e.target.value } },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.purpose.description}
                        onChange={(e) =>
                          setCfg((p) => ({
                            ...p,
                            frontpage: {
                              ...p.frontpage,
                              purpose: { ...p.frontpage.purpose, description: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Primary CTA label" />
                        <TextInput
                          value={config.frontpage.purpose.primaryCtaLabel}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                purpose: { ...p.frontpage.purpose, primaryCtaLabel: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Secondary CTA label" />
                        <TextInput
                          value={config.frontpage.purpose.secondaryCtaLabel}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                purpose: { ...p.frontpage.purpose, secondaryCtaLabel: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : id === 'about' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Eyebrow" />
                      <TextInput
                        value={config.frontpage.about.eyebrow}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, about: { ...p.frontpage.about, eyebrow: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.about.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                about: { ...p.frontpage.about, headingLine1: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.about.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({
                              ...p,
                              frontpage: {
                                ...p.frontpage,
                                about: { ...p.frontpage.about, headingEmphasis: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Quote (use new lines)" />
                      <TextArea
                        value={config.frontpage.about.quote}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, about: { ...p.frontpage.about, quote: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.about.description}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, about: { ...p.frontpage.about, description: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Features (4)" />
                      <div className="space-y-6">
                        {config.frontpage.about.features.slice(0, 4).map((f, idx) => (
                          <div key={idx} className="space-y-4">
                            <TextInput
                              value={f.title}
                              onChange={(e) =>
                                setCfg((p) => {
                                  const next = [...p.frontpage.about.features];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  return { ...p, frontpage: { ...p.frontpage, about: { ...p.frontpage.about, features: next } } };
                                })
                              }
                            />
                            <TextArea
                              value={f.text}
                              onChange={(e) =>
                                setCfg((p) => {
                                  const next = [...p.frontpage.about.features];
                                  next[idx] = { ...next[idx], text: e.target.value };
                                  return { ...p, frontpage: { ...p.frontpage, about: { ...p.frontpage.about, features: next } } };
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : id === 'archive' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Eyebrow" />
                      <TextInput
                        value={config.frontpage.archive.eyebrow}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, archive: { ...p.frontpage.archive, eyebrow: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.archive.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, archive: { ...p.frontpage.archive, headingLine1: e.target.value } } }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.archive.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, archive: { ...p.frontpage.archive, headingEmphasis: e.target.value } } }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.archive.description}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, archive: { ...p.frontpage.archive, description: e.target.value } } }))
                        }
                      />
                    </div>
                  </div>
                ) : id === 'vision' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Eyebrow" />
                      <TextInput
                        value={config.frontpage.vision.eyebrow}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, vision: { ...p.frontpage.vision, eyebrow: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.vision.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, vision: { ...p.frontpage.vision, headingLine1: e.target.value } } }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.vision.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, vision: { ...p.frontpage.vision, headingEmphasis: e.target.value } } }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.vision.description}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, vision: { ...p.frontpage.vision, description: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Bullets (4)" />
                      <div className="space-y-4">
                        {config.frontpage.vision.bullets.slice(0, 4).map((b, idx) => (
                          <TextInput
                            key={idx}
                            value={b}
                            onChange={(e) =>
                              setCfg((p) => {
                                const next = [...p.frontpage.vision.bullets];
                                next[idx] = e.target.value;
                                return { ...p, frontpage: { ...p.frontpage, vision: { ...p.frontpage.vision, bullets: next } } };
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <FieldLabel title="Eyebrow" />
                      <TextInput
                        value={config.frontpage.mission.eyebrow}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, eyebrow: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Heading line 1" />
                        <TextInput
                          value={config.frontpage.mission.headingLine1}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, headingLine1: e.target.value } } }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Heading emphasis" />
                        <TextInput
                          value={config.frontpage.mission.headingEmphasis}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, headingEmphasis: e.target.value } } }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <FieldLabel title="Description" />
                      <TextArea
                        value={config.frontpage.mission.description}
                        onChange={(e) =>
                          setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, description: e.target.value } } }))
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <FieldLabel title="Primary CTA label" />
                        <TextInput
                          value={config.frontpage.mission.primaryCtaLabel}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, primaryCtaLabel: e.target.value } } }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <FieldLabel title="Primary CTA href" />
                        <TextInput
                          value={config.frontpage.mission.primaryCtaHref}
                          onChange={(e) =>
                            setCfg((p) => ({ ...p, frontpage: { ...p.frontpage, mission: { ...p.frontpage.mission, primaryCtaHref: e.target.value } } }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-black tracking-[0.5em] uppercase text-white/30 mb-2">Import / Export</div>
              <div className="text-2xl font-black text-white">Config JSON</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIncludeSecrets((v) => !v)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  includeSecrets
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-white/5 border-white/10 text-white/30 hover:border-purple-500/30'
                }`}
              >
                Include API key
              </button>
              <button
                type="button"
                onClick={copy}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-purple-500/30 hover:text-white transition-all"
              >
                Copy export
              </button>
            </div>
          </div>

          <TextArea value={exportJson} readOnly className="min-h-[260px] font-mono text-xs" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <FieldLabel title="Import JSON" hint="Wklej JSON i kliknij Import. Nadpisze localStorage." />
              <TextArea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"version":1,...}'
                className="min-h-[220px] font-mono text-xs"
              />
              <button
                type="button"
                onClick={doImport}
                className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
              >
                Import
              </button>
            </div>
            <div className="space-y-3">
              <FieldLabel
                title="Tip"
                hint="Na serwerze statycznym zmiany są tylko w przeglądarce (localStorage). Jeśli chcesz to utrwalić globalnie, wyeksportuj JSON i wrzuć jako domyślny do repo."
              />
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white/30 leading-relaxed">
                Jeśli chcesz ukryć panel admina publicznie, najlepiej zrobić to na poziomie serwera (Basic Auth / IP allowlist)
                zamiast w JS.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

