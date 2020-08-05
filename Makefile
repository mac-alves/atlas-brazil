# Source:
# Institudo Brasileiro de Geologia e Estatistica
# http://mapas.ibge.gov.br/

# -- Configurations

# TopoJSON configurations
TOPOJSON = node --max_old_space_size=8192 node_modules/.bin/topojson -q 1e6

# All Brazilian states
STATES = \
	AC AL AM AP BA CE DF ES GO MA \
	MG MS MT PA PB PE PI PR RJ RN \
	RO RR RS SC SE SP TO

all: \
	node_modules \
	$(addprefix public/data/topo/,$(addsuffix -municipalities.json,$(STATES))) \
	$(addprefix public/data/topo/,$(addsuffix -micro.json,$(STATES))) \
	$(addprefix public/data/topo/,$(addsuffix -meso.json,$(STATES))) \
	$(addprefix public/data/topo/,$(addsuffix -state.json,$(STATES))) \
	$(addprefix public/data/topo/,$(addsuffix -immediate.json,$(STATES))) \
	$(addprefix public/data/topo/,$(addsuffix -intermediate.json,$(STATES))) \
	permission

# Install dependencies
node_modules:
	npm install

# Add execute permission
permission:
	chmod +x scripts/merge.py

# .SECONDARY with no dependencies marks all file targets mentioned in the makefile as secondary.
.SECONDARY:

# -- Downloading and extracting IBGE files

# Downloads the zip files
# ftp://geoftp.ibge.gov.br/malhas_digitais/municipio_2019/UFs/
zip/%.zip:
	$(eval STATE := $(patsubst %-municipalities,%,$*))
	$(eval STATE := $(patsubst %-micro,%,$(STATE)))
	$(eval STATE := $(patsubst %-meso,%,$(STATE)))
	$(eval STATE := $(patsubst %-state,%,$(STATE)))
	$(eval STATE := $(patsubst %-immediate,%,$(STATE)))
	$(eval STATE := $(patsubst %-intermediate,%,$(STATE)))
	$(eval FILENAME := $(subst -municipalities,_municipios,$*))
	$(eval FILENAME := $(subst -micro,_microrregioes,$(FILENAME)))
	$(eval FILENAME := $(subst -meso,_mesorregioes,$(FILENAME)))
	$(eval FILENAME := $(subst -state,_unidades_da_federacao,$(FILENAME)))
	$(eval FILENAME := $(subst -immediate,_regioes_geograficas_imediatas,$(FILENAME))) 
	$(eval FILENAME := $(subst -intermediate,_regioes_geograficas_intermediarias,$(FILENAME)))
	mkdir -p $(dir $@)
	curl 'ftp://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2019/UFs/$(STATE)/$(shell echo $(FILENAME) | tr A-Z a-z).zip' -o $@.download
	mv $@.download $@

# Extracts the files
tmp/%/: zip/%.zip
	rm -rf $(basename $@)
	mkdir -p $(dir $@)
	unzip -d tmp/$* $<
	$(eval REGION := $(patsubst %-municipalities,municipalities,$*))
	$(eval REGION := $(patsubst %-micro,micro,$*))
	$(eval REGION := $(patsubst %-meso,meso,$*))
	$(eval REGION := $(patsubst %-state,state,$*))
	$(eval REGION := $(patsubst %-immediate,immediate,$*))
	$(eval REGION := $(patsubst %-intermediate,intermediate,$*))
	mv $@/*.shp $@/map.shp
	mv $@/*.shx $@/map.shx
	mv $@/*.dbf $@/map.dbf
	mv $@/*.prj $@/map.prj

# -- Generate GeoJSON files

public/data/geo/%.json: tmp/%/
	mkdir -p $(dir $@)
	ogr2ogr -f GeoJSON $@ tmp/$*/map.shp
	iconv -f ISO-8859-1 -t UTF-8 $@ > $@.utf8
	mv $@.utf8 $@
	touch $@

# -- Generating TopoJSON files for each state

# For individual states, municipality level
public/data/topo/%-municipalities.json: public/data/geo/%-municipalities.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODM -p name=NM_MUNICIP -o $@ municipalities=$^
	touch $@

# For individual states, micro-region level
public/data/topo/%-micro.json: public/data/geo/%-micro.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=NM_MICRO -p name=NM_MICRO -o $@ micro=$^
	touch $@

# For individual states, meso-region level
public/data/topo/%-meso.json: public/data/geo/%-meso.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=NM_MESO -p name=NM_MESO -o $@ meso=$^
	touch $@

# For individual states, state level:
public/data/topo/%-state.json: public/data/geo/%-state.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODU -p name=NM_ESTADO -p region=NM_REGIAO -o $@ state=$^
	touch $@

# For individual states, immediate-region level:
public/data/topo/%-immediate.json: public/data/geo/%-immediate.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODU -p name=NM_ESTADO -p region=NM_REGIAO -o $@ state=$^
	touch $@

# For individual states, intermediate-region level:
public/data/topo/%-intermediate.json: public/data/geo/%-intermediate.json
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODU -p name=NM_ESTADO -p region=NM_REGIAO -o $@ state=$^
	touch $@

# -- Generating TopoJSON files for Brazil

# For Brazil with municipalities
public/data/topo/br-municipalities.json: $(addprefix public/data/geo/,$(addsuffix -municipalities.json,$(STATES)))
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODM -p name=NM_MUNICIP -o $@ -- $^
	./scripts/merge.py $@ > $@.merged
	mv $@.merged $@

# For Brasil with states
public/data/topo/br-states.json: $(addprefix public/data/geo/,$(addsuffix -state.json,$(STATES)))
	mkdir -p $(dir $@)
	$(TOPOJSON) --id-property=CD_GEOCODU -p name=NM_ESTADO -p region=NM_REGIAO -o $@ -- $^
	./scripts/merge.py $@ > $@.merged
	mv $@.merged $@

# Simplified version of state file
public/data/topo/br-states.min.json: public/data/topo/br-states.json
	$(TOPOJSON) -p --simplify-proportion=.2 -o $@ -- $^

# -- Clean

# Clean temporary files
clean-tmp:
	rm -rf tmp

# Clean extra files
clean-extra:
	rm -rf zip
	rm -rf tmp
	rm -rf public/data/geo

# Clean result files
clean-result:
	rm -rf shp
	rm -rf geo
	rm -rf topo

# Clean everything
clean: clean-tmp clean-result clean-extra
