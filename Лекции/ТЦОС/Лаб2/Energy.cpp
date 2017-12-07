// Energy.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "stdio.h"
#include "math.h"

#define m 200 // размер кадра анализа в отсчетах

int _tmain(int argc, _TCHAR* argv[])
{
	struct rifftype{ //заголовок RIFF файла
		char id[4];		//идентификатор файла = "RIFF" = 0x46464952
		long len;		//длина файла без этого заголовка
	} IDRiff;

	struct chucktype{ //Заголовок куска WAV
		char id[4];		//идентификатор = "WAVE" = 0x45564157
		char fmt[4];	//идентификатор = "fmt " = 0x20746D66
		long len;		//длина этого куска WAV - файла,
	} IDChuckWave;

	struct wavetype{ //кусок WAV
        short type;				//тип звуковых данных
        short channels;			//число каналов 
        long SamplesPerSec;		//частота выборки 
        long AvgBytesPerSec;	//частота выдачи байтов 
        short align;			//выравнивание
        short bits;				//число бит на выборку  
	} IDWave;

	struct sampletype{ //идентификатор выборки
		char id[4];		//идентификатор ="data" =0x61746164
        long len;		//длина выборки ( кратно 2 )
	} IDSampleWave;

	FILE *inf,*outf;
	inf=fopen("D:\\Work\\MADSP_lab\\Energy\\10.wav","rb");
	outf=fopen("D:\\Work\\MADSP_lab\\Energy\\10_Eng.wav","wb");
	if (inf==0)
	{
		return 0;
	}

	fread(&IDRiff,sizeof(IDRiff),1,inf);
	fread(&IDChuckWave,sizeof(IDChuckWave),1,inf);
	fread(&IDWave,sizeof(IDWave),1,inf);
	fread(&IDSampleWave,sizeof(IDSampleWave),1,inf);

	fwrite(&IDRiff,sizeof(IDRiff),1,outf);
	fwrite(&IDChuckWave,sizeof(IDChuckWave),1,outf);
	fwrite(&IDWave,sizeof(IDWave),1,outf);
	fwrite(&IDSampleWave,sizeof(IDSampleWave),1,outf);

	int N=IDSampleWave.len/2;		// Длина сигнала в отсчетах
	short s;			//Отсчет
	double sum;

	for (int i=0; i<N/m; i++)
	{
		sum=0;
		for (int k=0; k<m; k++)
		{
			fread(&s,2,1,inf);

//			sum+=labs(s);
//			sum+=abs(s);
			sum+=s*s;

		}
//		s=1*sum/m;
		s=1000*log10(0.01+sum/m);

		for (int k=0; k<m; k++)
			fwrite(&s,2,1,outf);
	}
	return 0;
}

